import PanelUI from "../ui/PanelUI";
import Depot from "./Depot";

class ProductionDepot extends Depot {
    panel: PanelUI

    constructor(depotData: {[k: string]: any}) {
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