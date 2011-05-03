.. _chart:

API Chart
=========

Here is a compact reference chart of the JW Player API. It includes all variables, functions and events the player supports:

| 
| 

=================================================  =================  =================  =================
| Subject                                       .  | Variable(s)      | Function(s)      | Event(s)
=================================================  =================  =================  =================
| Percentage loaded                                | getBuffer        |                  | onBufferChange
|                                                  |                  |                  | onBufferFull
| Media playback errors                            |                  |                  | onError
| Fullscreen playback                              | getFullscreen    | setFullscreen    | onFullscreen
| Media file metadata                              | getMeta          |                  | onMeta
| Muting of the audio                              | getMute          | setMute          | onMute
| The playlist                                     | getPlaylist      | load             | onPlaylist
| Current item                                     | getPlaylistItem  | playlistItem     | onPlaylistItem
|                                                  |                  | playlistPrev     | 
|                                                  |                  | playlistNext     | 
| Loading of the player                            |                  |                  | onReady
| Resizing of the player                           | getHeight        | resize           | onResize
|                                                  | getWidth         |                  | 
| The playback state                               | getState         | play             | onPlay
|                                                  |                  | pause            | onPause
|                                                  |                  | stop             | onIdle
|                                                  |                  |                  | onBuffer
|                                                  |                  |                  | onComplete
| The playback position                            | getPosition      | seek             | onTime
|                                                  | getDuration      |                  | 
| The audio volume                                 | getVolume        | setVolume        | onVolume
=================================================  =================  =================  =================