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

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onClick={handleClick}
            onDragStart={this.handleDragStart}
            onDragOver={this.handleDragOver}
            onDragEnter={this.handleDragEnter}
            onDragLeave={this.handleDragLeave}
            onDrop={this.handleDrop}
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