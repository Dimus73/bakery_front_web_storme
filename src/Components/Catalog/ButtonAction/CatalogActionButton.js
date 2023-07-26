export default class CatalogActionButton {

    constructor(editActionButton, deactivateActionButton, addActionButton, updateActionButton, canselUpdateActionButton, token) {
        this.editActionButton = editActionButton;
        this.deactivateActionButton = deactivateActionButton;
        this.addActionButton = addActionButton;
        this.updateActionButton = updateActionButton;
        this.canselUpdateActionButton = canselUpdateActionButton;
        this.token = token;
    }


// ----------------------------------------------
// Push Edit button in list (update an ingredient)
// ----------------------------------------------
    pushEditButton ( item ) {
        this.editActionButton ({...item})
    }

// ----------------------------------------------
// Push Deactivate button in list (update an ingredient)
// ----------------------------------------------
    async pushDeactivateButton (item, actionFunction) {
        await this.deactivateActionButton ({...item, active: false}, this.token);
    }

// ----------------------------------------------
// Push ADD button in add form (add new ingredient)
// ----------------------------------------------
    async pushAddButton (item, actionFunction) {
        await this.addActionButton(item, this.token);
    }

// ----------------------------------------------
// Push UPDATE button in update form (update an ingredient)
// ----------------------------------------------
    async pushUpdateButton (item, actionFunction) {
        await this.updateActionButton(item, this.token);
    }

    // ----------------------------------------------
// Push Cancel button in update form an equipment
// ----------------------------------------------
    pushCancelUpdateButton () {
        this.canselUpdateActionButton ({id:'', name:'', quantity:''});
    }


}