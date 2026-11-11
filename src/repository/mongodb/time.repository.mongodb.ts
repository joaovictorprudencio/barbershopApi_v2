import { Time } from "../../entities/time";
import { TimeRepository } from "../time.repository";
import { TimeModel } from "./models/Time";


export class TimeRepositoryMongo implements TimeRepository {


  
  
     constructor(){
        
    }
 
    async  validationData(date: Date, time: string, available: boolean):Promise<Time | null> {
        const timeExist = await TimeModel.findOne({
            available:available,
            date:date,
            time:time
        });

        if(!timeExist){
            return null;
        }

        return Time.persistence(
          timeExist.id,
          timeExist.available,
          timeExist.date,
          timeExist.time,
          timeExist.price ?? 0,
          timeExist.nameCustumer,
          timeExist.phoneCustumer,
          timeExist.counted ?? false
        );
        
    }

    async create(available: boolean, date: Date, time: string, price: number, nameCustumer: string, phoneCustumer: string): Promise<Time> {
        
        const timeCreated = await TimeModel.create({
           available,
            date,
            time,
            price,
            nameCustumer,
            phoneCustumer
        })

        return Time.persistence(
        timeCreated.id,
        timeCreated.available,
        timeCreated.date,
        timeCreated.time,
        price,
        timeCreated.nameCustumer,
        timeCreated.phoneCustumer
        )
    }

    async update(time: Time): Promise<Time | null> {

        
        const updatedTime = await TimeModel.findByIdAndUpdate(
            time.id,
            {
                $set: { 
                        available:time.available,
                        price: time.price ?? 0,
                        nameCustumer:time.nameCustumer,
                        phoneCustumer: time.phoneCustumer,
                        counted: time.counted ?? false
                      }
            },
            { new: true}
        )

        if(!updatedTime){
          return null;
        }
      
        return Time.persistence(
            updatedTime.id,
            updatedTime.available,
            updatedTime.date,
            updatedTime.time,
            updatedTime.price ?? 0,
            updatedTime.nameCustumer,
            updatedTime.phoneCustumer,
            updatedTime.counted ?? false

        )
    }


    async finbyId(timeId: number | string): Promise<Time | null>  {
    try {
        
        if (!timeId || typeof timeId !== 'string' || timeId.trim() === '') {
            return null;
        }

        const findTime = await TimeModel.findById(timeId.trim());

        if (!findTime) {
            return null;
        }

        return Time.persistence(
            findTime.id,
            findTime.available,
            findTime.date,
            findTime.time,
            findTime.price ?? 0,
            findTime.nameCustumer,
            findTime.phoneCustumer,
            findTime.counted ?? false
        );
    } catch (error) {
        console.error(`Erro ao buscar time com ID ${timeId}:`, error);
        return null;
    }
}

    async findByState(state: boolean): Promise<Time[] | null> {


            const timeForState = await TimeModel.find({available:state});

            if(!timeForState) {
                return null;
            }

            return timeForState.map(time => Time.persistence(
                time.id,
                time.available,
                time.date,
                time.time,
                time.price ?? 0,
                time.nameCustumer,
                time.phoneCustumer,
                time.counted ?? false
            ));
            
    }


     async findByDate(date: Date, time: string): Promise<Time | null> {

        const timeForDate = await TimeModel.findOne({
            date: date,
            time: time
        });

        if(!timeForDate){
            return null;
        }

        return Time.persistence(
           timeForDate.id,
           timeForDate.available,
           timeForDate.date,
           timeForDate.time,
           timeForDate.price ?? 0,
           timeForDate.nameCustumer,
           timeForDate.phoneCustumer,
           timeForDate.counted ?? false
       );
    }


    async delete(timeId: string): Promise<void> {
       const cancelTime = await TimeModel.findByIdAndDelete(timeId);
    }


    async deleteForAll(date: Date): Promise<void> {
        await TimeModel.deleteMany({
            date:{
                $lt: date
            }
        });
    }

    async findUncountedUnavailable(): Promise<Time[]> {
        const times = await TimeModel.find({ available: false, counted: false });

        return times.map(time => Time.persistence(
            time.id,
            time.available,
            time.date,
            time.time,
            time.price ?? 0,
            time.nameCustumer,
            time.phoneCustumer,
            time.counted ?? false
        ));
    }

    async markAsCounted(ids: string[]): Promise<void> {
        if (!ids || ids.length === 0) {
            return;
        }

        await TimeModel.updateMany(
            { _id: { $in: ids } },
            { $set: { counted: true } }
        );
    }

    async existsByDateAndState(date: Date, available: boolean): Promise<boolean> {
        const exists = await TimeModel.exists({ date, available });
        return exists !== null;
    }




}
