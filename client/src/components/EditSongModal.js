import { useContext } from "react";
import { GlobalStoreContext } from "../store";

function EditSongModal(){
    const { store } = useContext(GlobalStoreContext);
    

    function handleCancelButton(){
        let modal = document.getElementById('edit-song-modal');
        modal.classList.remove("is-visible");
    }

    function handleConfirmButton(new_song){
        store.addEditSongTransaction(store.targetEditSongIndex, new_song)
        let modal = document.getElementById('edit-song-modal');
        modal.classList.remove("is-visible");
    }


    return(
        <div class="modal" id="edit-song-modal">
        <div class="modal-root" id="edit-song-modal-root">
            <div class="modal-north">
                Edit Song
            </div>
            <div class="modal-center">
                <div class="modal-center-content">
                    <b>
                        <div>Title:<input 
                            type="text" id="title" style={{float: "right", fontSize:"16pt", width: "60%"}}
                            ></input></div>
                        <div>Artist:<input 
                            type="text" id="artist" style={{float: "right", fontSize:"16pt", width: "60%"}}
                            ></input></div>
                        <div>You Tube Id:<input 
                            type="text" id="youTubeId" style={{float: "right", fontSize:"16pt", width: "60%"}}
                            ></input></div>
                    </b>
                </div>
            </div>
            <div class="modal-south">
                <input 
                    type="button" 
                    id="edit-song-confirm-button" 
                    class="modal-button" 
                    value='Confirm' 
                    onClick={()=>handleConfirmButton({
                        title: document.getElementById("title").value,
                        artist: document.getElementById('artist').value,
                        youTubeId: document.getElementById('youTubeId').value
                    })}/>
                <input 
                    type="button" 
                    id="edit-song-cancel-button" 
                    class="modal-button" 
                    value='Cancel'
                    onClick={handleCancelButton} />
            </div>
            
        </div>
    </div>
    );
}
export default EditSongModal;