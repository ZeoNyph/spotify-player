export interface PlayerInfoRequest {
    device: Device
    shuffle_state: boolean
    smart_shuffle: boolean
    repeat_state: string
    timestamp: number
    context: Context
    progress_ms: number
    item: Playlist
    currently_playing_type: string
    actions: Actions
    is_playing: boolean
}

export interface Device {
    id: string
    is_active: boolean
    is_private_session: boolean
    is_restricted: boolean
    name: string
    supports_volume: boolean
    type: string
    volume_percent: number
}

export interface DeviceRequest {
    devices: Device[]
}

export interface Context {
    external_urls: ExternalUrls
    href: string
    type: string
    uri: string
}

export interface ExternalUrls {
    spotify: string
}

export interface Playlist {
    album: Album
    artists: Artist[]
    available_markets: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_ids: ExternalIds
    external_urls: ExternalUrls
    href: string
    id: string
    is_local: boolean
    name: string
    popularity: number
    preview_url: unknown
    track_number: number
    type: string
    uri: string
}

export interface Album {
    album_type: string
    artists: Artist[]
    available_markets: string[]
    external_urls: ExternalUrls
    href: string
    id: string
    images: Image[]
    name: string
    release_date: string
    release_date_precision: string
    total_tracks: number
    type: string
    uri: string
}

export interface Artist {
    external_urls: ExternalUrls
    href: string
    id: string
    name: string
    type: string
    uri: string
}
export interface Image {
    height: number
    url: string
    width: number
}

export interface ExternalIds {
    isrc: string
}

export interface Actions {
    disallows: Disallows
}

export interface Disallows {
    resuming: boolean
}

export interface PlaylistsRequest {
    href: string
    limit: number
    next: string | null
    offset: number
    previous: string | null
    total: number
    items: Playlist[]
}

export interface Playlist {
    collaborative: boolean
    description: string
    external_urls: ExternalUrls
    href: string
    id: string
    images: Image[]
    name: string
    owner: Owner
    primary_color: string | null
    public: boolean
    snapshot_id: string
    tracks: Tracks
    type: string
    uri: string
}

export interface Owner {
    display_name: string
    external_urls: ExternalUrls
    href: string
    id: string
    type: string
    uri: string
}

export interface Tracks {
    href: string
    total: number
}

export interface PlaylistRequest {
    uri: string
    tracks: PlaylistTracks
}

export interface PlaylistTracks {
    items: Item[]
}

export interface Item {
    track: Track
}

export interface Track {
    album: Album
    artists: Artist[]
    uri: string
    name: string
    id: string
}
