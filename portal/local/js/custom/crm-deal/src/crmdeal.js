import {Type} from 'main.core';
import {Contact} from "./contact";
import "./style.css"
export class Crmdeal
{
	constructor(options = { targetNode: ''})
	{
        this.targetNode = options.targetNode
        this.contactForm = new Contact()
	}

    init() {
        this.searchContacts()
        this.createDialog()

    }
    searchContacts() {
        if (this.targetNode) {
            this.targetNode.addEventListener('input', function (event) {
                this.getContacts(this.targetNode.value)

            }.bind(this))

            this.targetNode.addEventListener('blur', function(event) {
                if (this.dataset['id'] === '') this.value = ''
            });
        }
    }

    getContacts (fio = '') {
        BX.ajax.runComponentAction('custom:crm.deal.create', 'getContacts', {
            mode: 'ajax',
            data: {
                fio: fio
            }
        }).then(function (response) {
            let list = this.getEmptyList()
            if (response.data.length > 0) {
                list = this.getListContact(response.data)
            }
            if (response.data.length === 0) {
                this.targetNode.dataset['id'] = ''
            }
            this.dialog.setContent(list)

        }.bind(this), function (response) {
            console.error(response);
        });
    }

    createDialog()
    {
        const node = this.targetNode
        let dialog = BX.PopupWindowManager.create('search', node, {
            content: '',
            autoHide : true,
            offsetTop : 1,
            offsetLeft : 0,
            lightShadow : true,
            closeIcon : false,
            closeByEsc : true,
            width: 263,
            angle: false,
            padding: 0
        });

        BX.bind(node, 'input', BX.delegate( function()
        {
            if (!dialog.isShown())
            {
                dialog.show()
            }
        }, this ));

        this.dialog = dialog
    }

    getEmptyList()
    {
        let ul = document.createElement('ul')
        ul.setAttribute('class', 'contact-items')
        let li = document.createElement('li')
        let div = document.createElement('div')
        div.innerText = 'создать новый контакт'

        BX.bind(div, 'click', BX.proxy(function(){
            console.log('создать новый контакт')
            this.contactForm.show()

        }, this))

        li.appendChild(div)
        ul.appendChild(li)

        return ul
    }

    getListContact (items = [])
    {
        let li = null;
        let ul = document.createElement('ul')

        ul.setAttribute('class', 'contact-items')

        items.forEach(item => {

            li = document.createElement('li')
            li.setAttribute('class', '')
            li.setAttribute('data-id', item['ID'] )
            li.innerText = item['FULL_NAME']

            BX.bind(li, 'click', BX.proxy(function(){
                this.updSelectedContact(item)
            }, this))
            ul.appendChild(li)
        })

        return ul
    }

    updSelectedContact (item)
    {
        this.targetNode.value = item['FULL_NAME']
        this.targetNode.setAttribute('data-id', item['ID'])
    }

}
