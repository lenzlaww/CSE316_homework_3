import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";

    function handleDeleteSong(event){
        event.stopPropagation();
        console.log(index);
        store.markSongForDeletion(index);
    }

    function handleClick (event) {
        if (event.detail === 2) {
            event.stopPropagation();
            store.markSongForEdition(index);
        }
    }
    function handleDragStart (event){
        event.dataTransfer.setData("song", event.target.id);
    }

    let handleDragIgnore = (event) =>{
        event.preventDefault();
    }

    function handleDrop(event){
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1, target.id.indexOf("-") + 2);
        let sourceId = event.dataTransfer.getData("song");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1, target.id.indexOf("-") + 2);

        store.addMoveSongTransaction(sourceId, targetId);
    }

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onClick={handleClick}
            onDragStart={handleDragStart}
            onDragOver={handleDragIgnore}
            onDragEnter={handleDragIgnore}
            onDragLeave={handleDragIgnore}
            onDrop={handleDrop}
            draggable="true"
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                onClick={handleDeleteSong}
                value={"\u2715"}
            />
        </div>
    );
}

export default SongCard;