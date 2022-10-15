import { useContext } from "react";
import { GlobalStoreContext } from "../store";

function DeletePlaylistModal(){
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    //console.log(store);

    function handleCancelButton(){
        let modal = document.getElementById('delete-list-modal');
        modal.classList.remove("is-visible");
    }

    function handleConfirmButton(){
        

    }


    return (
        <div 
            class="modal" 
            id="delete-list-modal" 
            data-animation="slideInOutLeft">
                <div class="modal-root" id='verify-delete-list-root'>
                    <div class="modal-north">
                        Delete playlist?
                    </div>
                    <div class="modal-center">
                        <div class="modal-center-content">
                            Are you sure you wish to permanently delete the <b>{name}</b> playlist?
                        </div>
                    </div>
                    <div class="modal-south">
                        <input type="button" 
                            id="delete-list-confirm-button" 
                            class="modal-button" 
                            onClick={handleConfirmButton}
                            value='Confirm' />
                        <input type="button" 
                            id="delete-list-cancel-button" 
                            class="modal-button" 
                            onClick={handleCancelButton}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
}

export default DeletePlaylistModal;