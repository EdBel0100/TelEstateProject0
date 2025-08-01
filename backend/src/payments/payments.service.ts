import { Injectable } from '@nestjs/common';


@Injectable()
export class PaymentsService {
  //likely the most complicated method
  
  //this method will get the price the tenants are paying first
  //then this data will be send to whatever e-transfer api we choose
  //then after the payment is made we will store this data as csv, and upload it to s3
  //this method should execute on the first of each month, and then this will be shipped to to the accounting sofware everymonth as a nice csv
  //this will have an insane ammount of computation, it may need very strong infrastructure
  //there should also be a autopay option
  createPaymentForTenant(){

  }


  //should just fetch all the payments for a building 
  getCashFlowBybuilding(){


  }

   //should just fetch all the payments for a building 
   getCashFlowByManager(){


   }
   //should return something like {expected:1000, Paid:985}
   getPaidVsExpectedByProperty(){

   }

  //Basically should fetch the latest payment made by the tenant, if not matching the month then return unpaid
  getUnpaidRents(){


  }


}
