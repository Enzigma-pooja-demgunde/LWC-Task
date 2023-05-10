import { LightningElement,track,api } from 'lwc';
import fetchAllObjectList from '@salesforce/apex/GetAllObject.fetchAllObjectList';
import { NavigationMixin } from 'lightning/navigation';
export default class GetAllObject extends NavigationMixin(LightningElement) {
    
    @api selectedObject;
    @api objectList = [];
    @track allObjectsList= [];
    @track customobjectsList= [];
    @track standardObjectsList= [];
   
 
     @track objectTypeList =[
         {label : 'All',value : 'All'},
         {label : 'Custom',value : 'Custom'},
         {label : 'Standard',value : 'Standard'},
     ];
     connectedCallback( ) {
         fetchAllObjectList()
         .then((result)=> {
             if(result) {
                 for (let key in result) {
                     if(key.endsWith('__c')) {
                         this.customobjectsList.push({label :key, value:key});
                     } else if(!key.endsWith('__c')) {
                         this.standardObjectsList.push({label :key, value:key});
 
                     }
                     this.allObjectsList.push({label :key, value:key});
                    
                 }
             }else {
                 console.log('Object are not found')
             }
         }).catch((error) => {
             console.log('Object are not found')
 
         });
 
     }
     onObjectTypeChange(event) {
         this.lstFields=[];
         if(event.detail.value=='All') {
             this.objectList=this.allObjectsList;
         }else  if(event.detail.value=='Custom') {
             this.objectList=this.customobjectsList;
         }else  if(event.detail.value=='Standard') {
             this.objectList=this.standardObjectsList;
         }
 
    }

    handleObjectChange(event) {
        this.selectedObject = event.detail.value;
        const objectChangeEvent = new CustomEvent('objectchange', {
            detail: {
                selectedObject: this.selectedObject
            }
        });
        this.dispatchEvent(objectChangeEvent);
    }

    recordCreate( ){
        this[NavigationMixin.Navigate]({
            type:'standard__objectPage',
            attributes:{
                objectApiName:this.selectedObject,
                actionName:'new'
            }
        });

    }
   

}