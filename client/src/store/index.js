import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import AddSong_Transaction from '../transactions/AddSong_Transaction';
import DeleteSong_Transaction from '../transactions/DeleteSong_Transaction';
import EditSong_Transaction from '../transactions/EditSong_Transaction';
import MoveSong_Transaction from '../transactions/MoveSong_Transaction';
export const GlobalStoreContext = createContext({});

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    DELETE_LIST:"DELETE_LIST",
    UPDATE_LIST: "UPDATE_LIST",
    MARK_SONG_FOR_DELETION: "MARK_SONG_FOR_DELETION",
    MARK_SONG_FOR_EDITION: "MARK_SONG_FOR_EDITION"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        targetDeleteList: null,
        targetDeleteSongIndex: null,
        targetEditSongIndex: null,
        showModal: false,
    });


    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    targetDeleteList: payload,
                    showModal: true
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    showModal: false,
                    //MarkedListForDelete: null,
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                });
            }
            case GlobalStoreActionType.DELETE_LIST:{
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter -1,
                    listNameActive: false,
                })
            }
            case GlobalStoreActionType.UPDATE_LIST: {
                return setStore({
                    idNamePairs:store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                })
            }
            case GlobalStoreActionType.MARK_SONG_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    targetDeleteSongIndex: payload,
                    showModal: true,
                })
            }
            case GlobalStoreActionType.MARK_SONG_FOR_EDITION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    targetEditSongIndex: payload,
                    showModal: true
                })
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        console.log('close')
        store.history.push("/");
        tps.clearAllTransactions();
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: null
        });

        
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.createNewList = async function(){
        async function asyncCreateNewList(){
            let newList = {
                name: 'Untitled',
                songs:[]
            }
            let response = await api.createNewList(newList);
            if(response.data.success){
                //console.log(response)
                let playlist = response.data.playlist;
                //console.log(playlist);
                let pair = store.idNamePairs;
                let newpair = {
                    _id: playlist._id, 
                    name: playlist.name
                }
                pair.push(newpair);
                //console.log(pair);
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: playlist
                });
                
            }
            return response.data.playlist._id;
        }
        let id = await asyncCreateNewList();
        store.history.push("/playlist/" + id)
        //console.log(store.history)
    }

    store.markListForDeletion = function(idNamePair){
        console.log(idNamePair)
        let modal = document.getElementById('delete-list-modal');
        modal.classList.add("is-visible");
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: idNamePair
        });
        console.log(store)
    }

    store.deleteListById = function(id){
        async function asyncDeleteListById (id){
            let res = await api.deleteListById(id);
            if(res.data.success){
                //console.log(res.data)
                let deleteListId = res.data.id;
                let deleteListIndex
                for(let i = 0; i < store.idNamePairs.length; i++){
                    if(store.idNamePairs[i]._id === deleteListId){
                        deleteListIndex = i
                    }
                }
                let idNamePairs = store.idNamePairs
                //console.log(deleteListIndex)
                idNamePairs.splice(deleteListIndex,1)
                //console.log(idNamePairs)

                storeReducer({
                    type: GlobalStoreActionType.DELETE_LIST,
                    payload: idNamePairs
                })
                
            }

        }
        asyncDeleteListById(id);
        console.log(store.targetDeleteList)
    }

    store.addSong = function(){
        async function asyncAddSong(){
            let newSong ={
                title: "Untitled",
                artist: "Unknown",
                youTubeId: "dQw4w9WgXcQ"
            }
            let playlist = store.currentList;
            
            playlist.songs.push(newSong);
            console.log(playlist)
            let response = await api.updatePlaylistById(playlist._id, playlist)
            if (response.data.success){
                storeReducer({
                type: GlobalStoreActionType.UPDATE_LIST,
                payload: playlist
            })
            }
        };
        asyncAddSong();
    }

    store.markSongForDeletion = function(index){
        let modal = document.getElementById('delete-song-modal');
        modal.classList.add("is-visible");
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_DELETION,
            payload: index
        })
    }
    
    store.deleteSong = function(index){
        async function asyncDeleteSong(index){
            console.log(store.currentList);
            let currentList = store.currentList;
            currentList.songs.splice(index,1)
            let rep = await api.updatePlaylistById(currentList._id, currentList)
            if(rep.data.success){
                storeReducer({
                    type: GlobalStoreActionType.UPDATE_LIST,
                    payload: currentList
                })
            }
        }
        asyncDeleteSong(index)
    }

    store.markSongForEdition = function(index){
        let modal = document.getElementById('edit-song-modal');
        modal.classList.add("is-visible");
        document.getElementById('title').value = store.currentList.songs[index].title
        document.getElementById('artist').value = store.currentList.songs[index].artist
        document.getElementById('youTubeId').value = store.currentList.songs[index].youTubeId
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_EDITION,
            payload: index
        })
    }

    store.editSong = function(index, new_song){
        async function asyncEditSong(index, new_song){
            let currentList = store.currentList;
            currentList.songs[index] = new_song;
            let res = await api.updatePlaylistById(currentList._id, currentList);
            if(res.data.success){
                storeReducer({
                    type: GlobalStoreActionType.UPDATE_LIST,
                    payload: currentList
                })
            }
        }
        asyncEditSong(index, new_song)
    }

    store.addAdditionSongTransaction = function() {
        let transaction = new AddSong_Transaction(store);
        tps.addTransaction(transaction); 
    }

    store.addDeleteSongTransaction = function(index){
        let orig_song = store.currentList.songs[index]
        let transaction = new DeleteSong_Transaction(store, index, orig_song);
        tps.addTransaction(transaction); 
    }

    store.addDeletedSong = function(index, song){
        async function asyncAddDeletedSong(index, song){

            let playlist = store.currentList;
            
            playlist.songs.splice(index, 0, song);
            
            console.log(playlist)
            let response = await api.updatePlaylistById(playlist._id, playlist)
            if (response.data.success){
                storeReducer({
                type: GlobalStoreActionType.UPDATE_LIST,
                payload: playlist
            })
            }
        };
        asyncAddDeletedSong(index, song);
    }

    store.addEditSongTransaction = function(index, new_song){
        let oldSong = store.currentList.songs[index]
        let transaction = new EditSong_Transaction(store,oldSong, index, new_song);
        tps.addTransaction(transaction); 
    }

    //start in index
    store.moveSong = function (start, end){
        //console.log('here', start, end)
        async function asyncMoveSong(start, end){
        let list = store.currentList;
        
        let temp = list.songs[start];
        list.songs[start] = list.songs[end];
        list.songs[end] = temp;
        
        let response = await api.updatePlaylistById(list._id, list)
            if (response.data.success){
                storeReducer({
                type: GlobalStoreActionType.UPDATE_LIST,
                payload: list
            })
            }
        };
        asyncMoveSong(start, end);
    }

    store.addMoveSongTransaction = function(oldIndex, newIndex){
        let transaction = new MoveSong_Transaction(store,oldIndex, newIndex);
        tps.addTransaction(transaction); 
    }

    store.hideDeleteListModal = function(){
        let modal = document.getElementById('delete-list-modal');
        modal.classList.remove("is-visible");
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: store.currentList
        })
    }

    store.hideDeleteSongModal = function(){
        let modal = document.getElementById('delete-song-modal');
        modal.classList.remove("is-visible");
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: store.currentList
        })
    }

    store.hideEditSongModal = function(){
        let modal = document.getElementById('edit-song-modal');
        modal.classList.remove("is-visible");
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: store.currentList
        })
    }

    store.hasRedo = function(){
        return tps.hasTransactionToRedo();
    }

    store.hasUndo = function(){
        return tps.hasTransactionToUndo();
    }

    function keypress(event){
        if(event.ctrlKey&& !store.showModal){
            if(event.key === 'z'){
                if(tps.hasTransactionToUndo()){
                    store.undo();
                }
                
            }
            if(event.key ==='y'){
                if(tps.hasTransactionToRedo()){
                    store.redo();
                }
                
            }
        }

    }
    document.onkeydown=(e) => keypress(e, this);

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}