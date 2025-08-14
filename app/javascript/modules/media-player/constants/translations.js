// Mapping: Video.js native keys -> i18n translation keys
// This allows overriding Video.js default strings with custom translations
export const VIDEOJS_I18N_KEY_MAP = {
    // Control labels
    Play: 'media_player.play',
    Pause: 'media_player.pause',
    Replay: 'media_player.replay',
    'Current Time': 'media_player.current_time',
    Duration: 'media_player.duration',
    'Remaining Time': 'media_player.remaining_time',
    'Stream Type': 'media_player.stream_type',
    LIVE: 'media_player.live',
    Loaded: 'media_player.loaded',
    Progress: 'media_player.progress',
    Fullscreen: 'media_player.fullscreen',
    'Exit Fullscreen': 'media_player.exit_fullscreen',
    Mute: 'media_player.mute',
    Unmute: 'media_player.unmute',
    'Playback Rate': 'media_player.playback_rate',
    Chapters: 'media_player.chapters',

    // Subtitles
    Subtitles: 'media_player.subtitles',
    'subtitles off': 'media_player.subtitles_off',
    'subtitles settings': 'media_player.subtitles_settings',
    // For some reason, Video.js uses "captions" in English and "subtitles" in other languages
    // This is a workaround to ensure consistency across languages
    // Only change the strings for media_player.subtitles*, not media_player.captions*
    Captions: 'media_player.subtitles',
    'captions off': 'media_player.subtitles_off',
    'captions settings': 'media_player.subtitles_settings',

    // Error messages
    'You aborted the media playback': 'media_player.error.aborted',
    'A network error caused the media download to fail part-way.':
        'media_player.error.network',
    'The media could not be loaded, either because the server or network failed or because the format is not supported.':
        'media_player.error.not_supported',
    'The media playback was aborted due to a corruption problem or because the media used features your browser did not support.':
        'media_player.error.corrupted',
    'No compatible source was found for this media.':
        'media_player.error.no_source',
    'The media is encrypted and we do not have the keys to decrypt it.':
        'media_player.error.encrypted',

    // Other controls
    'Play Video': 'media_player.play_video',
    Close: 'media_player.close',
    'Modal Window': 'media_player.modal_window',
    'This is a modal window': 'media_player.modal_window_description',
    'This modal can be closed by pressing the Escape key or activating the close button.':
        'media_player.modal_close_instruction',
    'Close Modal Dialog': 'media_player.close_modal_dialog',

    // Settings
    'descriptions settings': 'media_player.descriptions_settings',
    ', opens captions settings dialog': 'media_player.opens_captions_settings',
    ', opens subtitles settings dialog':
        'media_player.opens_subtitles_settings',
    ', opens descriptions settings dialog':
        'media_player.opens_descriptions_settings',
    ', selected': 'media_player.selected',

    // Descriptions
    Descriptions: 'media_player.descriptions',
    'descriptions off': 'media_player.descriptions_off',

    // Audio tracks
    'Audio Track': 'media_player.audio_track',

    // Caption styling
    Text: 'media_player.text',
    White: 'media_player.white',
    Black: 'media_player.black',
    Red: 'media_player.red',
    Green: 'media_player.green',
    Blue: 'media_player.blue',
    Yellow: 'media_player.yellow',
    Magenta: 'media_player.magenta',
    Cyan: 'media_player.cyan',
    Background: 'media_player.background',
    Window: 'media_player.window',
    Transparent: 'media_player.transparent',
    'Semi-Transparent': 'media_player.semi_transparent',
    Opaque: 'media_player.opaque',
    'Font Size': 'media_player.font_size',
    'Text Edge Style': 'media_player.text_edge_style',
    None: 'media_player.none',
    Raised: 'media_player.raised',
    Depressed: 'media_player.depressed',
    Uniform: 'media_player.uniform',
    'Drop shadow': 'media_player.drop_shadow',
    'Font Family': 'media_player.font_family',
    'Proportional Sans-Serif': 'media_player.proportional_sans_serif',
    'Monospace Sans-Serif': 'media_player.monospace_sans_serif',
    'Proportional Serif': 'media_player.proportional_serif',
    'Monospace Serif': 'media_player.monospace_serif',
    Casual: 'media_player.casual',
    Script: 'media_player.script',
    'Small Caps': 'media_player.small_caps',
    Reset: 'media_player.reset',
    'restore all settings to the default values':
        'media_player.restore_defaults',
    Done: 'media_player.done',
    'Caption Settings Dialog': 'media_player.caption_settings_dialog',
    'Beginning of dialog window. Escape will cancel and close the window.':
        'media_player.dialog_beginning',
    'End of dialog window.': 'media_player.dialog_end',

    // Player types
    'Audio Player': 'media_player.audio_player',
    'Video Player': 'media_player.video_player',
    'Progress Bar': 'media_player.progress_bar',
    'progress bar timing: currentTime={1} duration={2}':
        'media_player.progress_timing',
    'Volume Level': 'media_player.volume_level',
    '{1} is loading.': 'media_player.loading',

    // Live streaming
    'Seek to live, currently behind live': 'media_player.seek_to_live_behind',
    'Seek to live, currently playing live': 'media_player.seek_to_live_current',

    // Picture-in-Picture
    'Exit Picture-in-Picture': 'media_player.exit_pip',
    'Picture-in-Picture': 'media_player.pip',
    'Playing in Picture-in-Picture': 'media_player.playing_in_pip',

    // Skip controls
    'Skip forward {1} seconds': 'media_player.skip_forward',
    'Skip backward {1} seconds': 'media_player.skip_backward',

    // Misc
    'No content': 'media_player.no_content',
    Color: 'media_player.color',
    Opacity: 'media_player.opacity',
    'Text Background': 'media_player.text_background',
    'Caption Area Background': 'media_player.caption_area_background',
};
