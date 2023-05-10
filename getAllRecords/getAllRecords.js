import { LightningElement,api,track,wire } from 'lwc';
import fetchAllObjectList from '@salesforce/apex/GetAllObject.fetchAllObjectList';
import { NavigationMixin } from 'lightning/navigation';
import fetchAllRecordsOfSelectedObject from '@salesforce/apex/GetAllObject.fetchAllRecordsOfSelectedObject';
export default class GetAllRecords extends NavigationMixin (LightningElement) {
    actions = 
    [
        { label: 'Edit', name: 'edit' },
        { label: 'View', name: 'view' },
        { label: 'Delete', name: 'delete' },
    ]
    
    @api recordId
    @track lstFields = [];
    @track showFields = false;
    @api selectedObject ='';
    arrayToSend = [];
    allRecordsOfSelectedObject = [];
    columnsMap = [];
    showButton=false;
    showDataArray=[];
    TempName=[];
/*
handleCheckBoxClick(event) {
    this.showButton=true;
    this.selectedObject=event.detail.selectedObject;
  const  selectedFields = event.detail.selectedFields;
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
}*/

    handleEditAndViewAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
    
        switch (actionName) {
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: this.selectedObject,
                        actionName: 'edit'
                    }
                });
                break;
    
            case 'view':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: this.selectedObject,
                        actionName: 'view'
                    }
                });
                break;
            case 'delete':
              const recordId = row.Id;
                    deleteRecord(recordId)
                      .then(() => {
                // remove the deleted record from the table
                 const index = this.allRecordsOfSelectedObject.findIndex(record => record.Id === recordId);
                 this.allRecordsOfSelectedObject.splice(index, 1);
                     this.showToast();
                        })
                      .catch(error => {
                       console.log(error);
                    });
                        break;
            default:
                break;
        }
    }

    showToast() {
        const event = new ShowToastEvent({
            title: 'Record Deleted',
            message: 'Record Deleted Successfully',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }

    @wire(fetchAllRecordsOfSelectedObject,{strObjectName: "$selectedObject"})
     wiredObjectRecords({ data, error }) {
        console.log(data)
        if (data) {
            let tempRecs = [];
  
            data.forEach((record) => {
                let tempRec = Object.assign({}, record);

                tempRec.TempName = "/" + tempRec.Id;

                tempRecs.push(tempRec);
                 console.log(tempRec);
            });

            this.showDataArray = tempRecs;
            console.log(this.showDataArray)

            this.error = undefined;
        } else if (error) {
            this.error = error;

            this. showDataArray = undefined;
        }
    }

    handleShowData() { 
        this.allRecordsOfSelectedObject=this.showDataArray;
        console.log(allRecordsOfSelectedObject)
       
    }
}