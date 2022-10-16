import { useContext } from "react";
import { GlobalStoreContext } from "../store";

function DeleteSongModal(){
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if(store.targetDeleteSongIndex){
        name = store.currentList.songs[store.targetDeleteSongIndex].title
    }

    function handleCancelButton(){
        store.hideDeleteSongModal();
    }

    function handleConfirmButton(){
        store.addDeleteSongTransaction(store.targetDeleteSongIndex)
        store.hideDeleteSongModal();
    }

    return (
        <div 
            class="modal" 
            id="delete-song-modal" 
            data-animation="slideInOutLeft">
                <div class="modal-root" id='verify-delete-song-root'>
                    <div class="modal-north">
                        Remove song?
                    </div>
                    <div class="modal-center">
                        <div class="modal-center-content">
                        Are you sure you wish to permanently remove <b>{name}</b> from the playlist?
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
export default DeleteSongModal;