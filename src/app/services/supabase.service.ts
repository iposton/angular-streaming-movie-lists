import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

type ListType = 'favorite' | 'reminder';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private client: SupabaseClient | null = null;
  readonly session$ = new BehaviorSubject<Session | null>(null);
  readonly listsChanged$ = new BehaviorSubject<void>(undefined);

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    if (!isPlatformBrowser(platformId)) return;

    this.client = createClient(environment.supabaseUrl, environment.supabasePublishableKey);
    this.client.auth.getSession().then(({ data }) => {
      this.session$.next(data.session);
      if (data.session) this.syncLocalLists();
    });
    this.client.auth.onAuthStateChange((_event, session) => {
      this.session$.next(session);
      if (session) setTimeout(() => this.syncLocalLists());
    });
  }

  get isSignedIn(): boolean {
    return this.session$.value != null;
  }

  get email(): string {
    return this.session$.value?.user.email || '';
  }

  async sendMagicLink(email: string): Promise<void> {
    this.requireClient();
    const { error } = await this.client!.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) throw error;
  }

  async signOut(): Promise<void> {
    this.requireClient();
    const { error } = await this.client!.auth.signOut();
    if (error) throw error;
  }

  async saveItem(item: any, listType: ListType): Promise<void> {
    if (!this.client || !this.isSignedIn) return;

    const mediaType = item.media_type === 'tv' || item.type === 'tv' ? 'tv' : 'movie';
    const { error } = await this.client.from('saved_titles').upsert({
      user_id: this.session$.value!.user.id,
      tmdb_id: item.id,
      media_type: mediaType,
      list_type: listType,
      item_data: item,
      reminder_date: listType === 'reminder' ? new Date().toISOString().slice(0, 10) : null
    }, { onConflict: 'user_id,tmdb_id,media_type,list_type' });

    if (error) throw error;
  }

  async removeItem(item: any, listType: ListType): Promise<void> {
    if (!this.client || !this.isSignedIn) return;

    const mediaType = item.media_type === 'tv' || item.type === 'tv' ? 'tv' : 'movie';
    const { error } = await this.client
      .from('saved_titles')
      .delete()
      .eq('tmdb_id', item.id)
      .eq('media_type', mediaType)
      .eq('list_type', listType);

    if (error) throw error;
  }

  async syncLocalLists(): Promise<void> {
    if (!this.client || !this.isSignedIn) return;

    const migrationKey = `supabase-lists-migrated-${this.session$.value!.user.id}`;
    if (!localStorage.getItem(migrationKey)) {
      await this.uploadLocalList('movFavorites', 'favorite');
      await this.uploadLocalList('currentItem', 'reminder');
      localStorage.setItem(migrationKey, 'true');
    }

    const { data, error } = await this.client
      .from('saved_titles')
      .select('tmdb_id,list_type,item_data,created_at');
    if (error) throw error;

    const favorites = [];
    const reminders = [];
    for (const row of data || []) {
      const entry = {
        [row.list_type === 'favorite' ? 'favorite' : 'newReminder']: row.item_data,
        dateAdded: row.created_at.slice(0, 10),
        id: row.tmdb_id
      };
      (row.list_type === 'favorite' ? favorites : reminders).push(entry);
    }
    localStorage.setItem('movFavorites', JSON.stringify(favorites));
    localStorage.setItem('currentItem', JSON.stringify(reminders));
    this.listsChanged$.next();
  }

  getCachedList(listType: ListType): any[] {
    const storageKey = listType === 'favorite' ? 'movFavorites' : 'currentItem';
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch {
      return [];
    }
  }

  setCachedList(listType: ListType, items: any[]): void {
    const storageKey = listType === 'favorite' ? 'movFavorites' : 'currentItem';
    localStorage.setItem(storageKey, JSON.stringify(items));
    this.listsChanged$.next();
  }

  private async uploadLocalList(storageKey: string, listType: ListType): Promise<void> {
    const localItems = JSON.parse(localStorage.getItem(storageKey) || '[]');
    for (const entry of localItems) {
      const item = entry[listType === 'favorite' ? 'favorite' : 'newReminder'];
      if (item?.id != null) await this.saveItem(item, listType);
    }
  }

  private requireClient(): void {
    if (!this.client) throw new Error('Supabase is only available in the browser.');
  }
}
