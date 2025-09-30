"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoublyLinkedList = exports.DoublyLinkedNode = void 0;
class DoublyLinkedNode {
    constructor(song) {
        this.prev = null;
        this.next = null;
        this.song = song;
    }
}
exports.DoublyLinkedNode = DoublyLinkedNode;
class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
    addAtEnd(song) {
        const node = new DoublyLinkedNode(song);
        if (!this.tail) {
            this.head = this.tail = node;
        }
        else {
            this.tail.next = node;
            node.prev = this.tail;
            this.tail = node;
        }
        this.length++;
    }
    addAtStart(song) {
        const node = new DoublyLinkedNode(song);
        if (!this.head) {
            this.head = this.tail = node;
        }
        else {
            node.next = this.head;
            this.head.prev = node;
            this.head = node;
        }
        this.length++;
    }
    addAtPosition(song, pos) {
        if (pos <= 0)
            return this.addAtStart(song);
        if (pos >= this.length)
            return this.addAtEnd(song);
        let curr = this.head;
        for (let i = 0; i < pos - 1 && curr; i++)
            curr = curr.next;
        if (!curr)
            return;
        const node = new DoublyLinkedNode(song);
        node.next = curr.next;
        node.prev = curr;
        if (curr.next)
            curr.next.prev = node;
        curr.next = node;
        this.length++;
    }
    removeAtPosition(pos) {
        if (pos < 0 || pos >= this.length)
            return;
        let curr = this.head;
        for (let i = 0; i < pos && curr; i++)
            curr = curr.next;
        if (!curr)
            return;
        if (curr.prev)
            curr.prev.next = curr.next;
        if (curr.next)
            curr.next.prev = curr.prev;
        if (curr === this.head)
            this.head = curr.next;
        if (curr === this.tail)
            this.tail = curr.prev;
        this.length--;
    }
    toArray() {
        const arr = [];
        let curr = this.head;
        while (curr) {
            arr.push(curr.song);
            curr = curr.next;
        }
        return arr;
    }
}
exports.DoublyLinkedList = DoublyLinkedList;
