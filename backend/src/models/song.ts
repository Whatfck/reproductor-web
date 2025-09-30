export interface Song {
  id?: number;
  title: string;
  artist?: string;
  album?: string;
  year?: number;
  filePath: string;
}

export class DoublyLinkedNode {
  song: Song;
  prev: DoublyLinkedNode | null = null;
  next: DoublyLinkedNode | null = null;
  constructor(song: Song) {
    this.song = song;
  }
}

export class DoublyLinkedList {
  head: DoublyLinkedNode | null = null;
  tail: DoublyLinkedNode | null = null;
  length = 0;

  addAtEnd(song: Song) {
    const node = new DoublyLinkedNode(song);
    if (!this.tail) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this.length++;
  }

  addAtStart(song: Song) {
    const node = new DoublyLinkedNode(song);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }
    this.length++;
  }

  addAtPosition(song: Song, pos: number) {
    if (pos <= 0) return this.addAtStart(song);
    if (pos >= this.length) return this.addAtEnd(song);
    let curr = this.head;
    for (let i = 0; i < pos - 1 && curr; i++) curr = curr.next;
    if (!curr) return;
    const node = new DoublyLinkedNode(song);
    node.next = curr.next;
    node.prev = curr;
    if (curr.next) curr.next.prev = node;
    curr.next = node;
    this.length++;
  }

  removeAtPosition(pos: number) {
    if (pos < 0 || pos >= this.length) return;
    let curr = this.head;
    for (let i = 0; i < pos && curr; i++) curr = curr.next;
    if (!curr) return;
    if (curr.prev) curr.prev.next = curr.next;
    if (curr.next) curr.next.prev = curr.prev;
    if (curr === this.head) this.head = curr.next;
    if (curr === this.tail) this.tail = curr.prev;
    this.length--;
  }

  toArray(): Song[] {
    const arr: Song[] = [];
    let curr = this.head;
    while (curr) {
      arr.push(curr.song);
      curr = curr.next;
    }
    return arr;
  }
}
