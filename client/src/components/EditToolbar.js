import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "playlister-button";

    const tps = new jsTPS();

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        //history.push("/");
        store.closeCurrentList();
    }
    function handleAddSong(){
        store.addAdditionSongTransaction();
    }
    let editStatus = false;
    let editStatusRedo = false;
    let editStatusUndo = false;
    if (store.isListNameEditActive) {
        editStatus = true;
        editStatusRedo = true;
        editStatusUndo = true;
    }
    if(!store.currentList){
        editStatus = true;
        editStatusRedo = true;
        editStatusUndo = true;
    }
    if(store.currentList){
        editStatus = false;
        editStatusRedo = false;
        editStatusUndo = false;
        if(tps.hasTransactionToRedo){
            editStatusRedo = false;
        }else if(!tps.hasTransactionToRedo){
            editStatusRedo = true;
        }
        if(tps.hasTransactionToUndo){
            editStatusUndo = false;
        }else if(!tps.hasTransactionToUndo){
            editStatusUndo = true;
        }
    }
    if (store.showModal){
        editStatus = true;
        editStatusRedo = true;
        editStatusUndo = true;
    }
    
    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={editStatus}
                value="+"
                onClick={handleAddSong}
                className={enabledButtonClass}
            />
            <input
                type="button"
                id='undo-button'
                disabled={editStatusUndo}
                value="⟲"
                className={enabledButtonClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={editStatusRedo}
                value="⟳"
                className={enabledButtonClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={editStatus}
                value="&#x2715;"
                className={enabledButtonClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;