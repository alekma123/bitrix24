import {Type} from 'main.core';
import {Contact} from "./contact";
import "./style.css"

export class Crmdeal {
    constructor (options = {nodeInput: ''}) {
        this.nodeInput = options.nodeInput
        this.contactForm = new Contact()
    }

    init () {
        this.searchContacts()
        this.createDialog()

    }

    searchContacts () {
        if (!this.nodeInput) return

        this.nodeInput.addEventListener('input', () => this.getContacts(this.nodeInput.value))
        this.nodeInput.addEventListener('blur', () => {
            if (this.dataset['id'] === '') this.value = ''
        })

    }

    getContacts (fio = '') {
        BX.ajax.runComponentAction('custom:crm.deal.create', 'getContacts', {
            mode: 'ajax',
            data: {
                fio: fio
            }
        }).then(function (response) {
            let list = this.getEmptyUl()
            if (response.data.length > 0) {
                list = this.getUlContacts(response.data)
            }
            if (response.data.length === 0) {
                this.nodeInput.dataset['id'] = ''
            }
            this.dialog.setContent(list)

        }.bind(this), function (response) {
            console.error(response);
        });
    }

    createDialog () {
        const node = this.nodeInput
        this.dialog = BX.PopupWindowManager.create('search', node, {
            content: '',
            autoHide: true,
            offsetTop: 1,
            offsetLeft: 0,
            lightShadow: true,
            closeIcon: false,
            closeByEsc: true,
            width: 263,
            angle: false,
            padding: 0
        });

        node.addEventListener('input', () => {
            if (!this.dialog.isShown()) {
                this.dialog.show()
            }
        })
    }

    getEmptyUl () {
        const ul = document.createElement('ul')
        const li = document.createElement('li')
        const div = document.createElement('div')

        ul.classList.add('class', 'contact-items')

        div.innerText = 'создать новый контакт'
        div.addEventListener('click', () => this.contactForm.show())

        li.appendChild(div)

        ul.appendChild(li)

        return ul
    }

    getUlContacts (items = []) {
        const ul = document.createElement('ul')
        ul.classList.add('contact-items')

        items.forEach(item => {
            const li = document.createElement('li')

            li.dataset.id = item['ID'] ?? 0
            li.innerText = item['FULL_NAME'] ?? ''
            li.addEventListener('click', () => this.updSelectedContact(item))

            ul.appendChild(li)
        })

        return ul
    }

    updSelectedContact (item) {
        this.nodeInput.value = item['FULL_NAME']
        this.nodeInput.setAttribute('data-id', item['ID'])
    }

}
