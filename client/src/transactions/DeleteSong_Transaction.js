import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * MoveSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class DeleteSong_Transaction extends jsTPS_Transaction {
    constructor(store, initIndex, initSong) {
        super();
        this.store = store;
        this.index = initIndex;
        this.song = initSong;
    }

    doTransaction() {
        this.store.deleteSong(this.index);
    }
    
    undoTransaction() {
        this.store.addDeletedSong(this.index, this.song);
    }
}

