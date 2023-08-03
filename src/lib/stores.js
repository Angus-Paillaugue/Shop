import { persisted } from 'svelte-local-storage-store'
import { writable } from 'svelte/store'

export const cart = persisted('cart', [])

export const searchBar = writable(false);
export const cartAside = writable(false);
export const navbar = writable(false);