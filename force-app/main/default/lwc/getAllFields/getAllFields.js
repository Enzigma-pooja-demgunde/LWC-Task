import { LightningElement,api,track } from 'lwc';
import fetchAllFieldList from '@salesforce/apex/GetAllObject.fetchAllFieldList'
import fetchAllObjectList from '@salesforce/apex/GetAllObject.fetchAllObjectList';
import { NavigationMixin } from 'lightning/navigation';
export default class GetAllFields extends NavigationMixin(LightningElement) {
    @api recordId
    @track lstFields = [];
    @track showFields = false;
    @api selectedObject = '';
    arrayToSend = [];
    allRecordsOfSelectedObject = [];
    columnsMap = [];
   showButton = false;
    showDataArray=[];
    TempName=[];


handleObjectChange(event) {
        this.selectedObject = event.detail.selectedObject;
        this.lstFields = [];
      //  this.allRecordsOfSelectedObject = [];
      this.columnsMap = [];
        this.arrayToSend = [];
        this.showFields = true;
        this.showButton = true

        this.getFieldsOnObjectChange();
    }

getFieldsOnObjectChange() {
        fetchAllFieldList({strObjectName:this.selectedObject})
        .then(result => {
                this.lstFields = [];
            for(let key in result ) {
                this.lstFields.push({ label : key, value:key});
            }
        }).catch((error) => {
            console.log('error in getting fields')
    
        })
       
    }

handleCheckBoxClick(event) {
    this.arrayToSend = [];
    for (let index in event.detail.value) {
        this.arrayToSend.push(event.detail.value[index]);
    }
    this.showButton = true
    this.arrayToSend = [];
  //  const selectedFields=this.arrayToSend;
   // const checkboxClickEvent = new CustomEvent('checkboxclick', { detail: { selectedFields } });
 // this.dispatchEvent(checkboxClickEvent);

 const selectedFields = this.arrayToSend;

    this.columnsMap = [
        ...selectedFields.map(fieldName => ({
            label: fieldName,
            fieldName: fieldName==='Name'?'TempName':fieldName,
            type: fieldName === 'Name' ? 'url' : 'text',
            typeAttributes: {
                label: {
                    fieldName: 'Name',
                    target: '_blank'
                },
                target:fieldName ==="Name" ?"_blank": null,
            }
        })),
        {
            type: 'action',
            typeAttributes: {
                target: '_blank',
                rowActions: this.actions
            }
        }
    ];
}
}