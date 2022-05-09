import Depot from "./Depot";

class ProductionDepot extends Depot {

    constructor(depotData) {
        super(depotData)
    }

    select() {
        super.select()
        this.panel.unhide()
    }

    deselect() {
        //If the mouse is not inside of the panel then deselect me and hide me        
        if (!this.panel.mouseOver()) {
            super.deselect()
            this.panel.hide()
        }
    }
}

export default ProductionDepot