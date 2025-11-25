import './imask';
import 'ui.notification'

export class Contact {
    constructor () {
        this.createDialog()
        this.initCreateContact()
    }

    show () {
        if (!this.dialog.isShown()) {
            this.dialog.show()
            this.initMask()
        }
    }

    initMask () {
        const phoneInput = document.getElementById('tel')
        IMask(phoneInput, {
            mask: '+{7} (000) 000-00-00'
        })
    }

    createDialog () {
        const node = ''
        const context = this
        this.dialog = BX.PopupWindowManager.create('create', node, {
            content: context.getForm(),
            offsetTop: 1,
            offsetLeft: 0,
            width: 400,
            lightShadow: true,
            closeIcon: true,
            closeByEsc: true,
            padding: 0,
            autoHide: true,
            overlay: true,
            titleBar: {
                content: BX.create("h2",
                    {
                        html: 'Создать контакт',
                        props: {
                            className: 'form-title'
                        }
                    })
            },
        })
    }

    createContact (event) {
        const formData = new FormData(document.getElementById('create-contact'))
        this.request(Object.fromEntries(formData.entries()))
    }

    initCreateContact () {
        const form = document.getElementById('create')

        form.addEventListener('submit', (event) => {
            event.preventDefault()
            const formData = new FormData(event.target)
            this.request(Object.fromEntries(formData))
        })
    }

    request (contact) {
        BX.ajax.runComponentAction('custom:crm.deal.create', 'createContact', {
            mode: 'ajax',
            data: {
                contact: contact
            }
        }).then(function (response) {

            BX.UI.Notification.Center.notify({
                content: "Контакт успешно создан"
            });
            this.dialog.close()

        }.bind(this), function (response) {

            BX.UI.Notification.Center.notify({
                content: `Ошика создания контакта. ${response.errors[0].message}`
            });
            this.dialog.close()

        });
    }

    getForm () {
        const div = document.createElement('div')
        div.innerHTML = `
           <form class="ui-form" id="create-contact">
                <div class="ui-form-row">
                    <div class="ui-form-label">
                        <div class="ui-ctl-label-text">Фамилия</div>
                    </div>
                    <div class="ui-form-content">
                        <div class="ui-ctl ui-ctl-textbox ui-ctl-w100">
                            <input 
                                type="text" 
                                class="ui-ctl-element" 
                                placeholder=""
                                name="LAST_NAME"
                                >
                        </div>
                    </div>
                </div>
                <div class="ui-form-row">
                    <div class="ui-form-label">
                        <div class="ui-ctl-label-text">Имя</div>
                    </div>
                    <div class="ui-form-content">
                        <div class="ui-ctl ui-ctl-textbox ui-ctl-w100">
                            <input 
                                type="text" 
                                class="ui-ctl-element" 
                                placeholder=""
                                name="NAME"
                                required
                                >
                        </div>
                    </div>
                </div>
                <div class="ui-form-row">
                    <div class="ui-form-label">
                        <div class="ui-ctl-label-text">Отчество</div>
                    </div>
                    <div class="ui-form-content">
                        <div class="ui-ctl ui-ctl-textbox ui-ctl-w100">
                            <input 
                                type="text" 
                                class="ui-ctl-element" 
                                placeholder=""
                                name="SECOND_NAME"
                                >
                        </div>
                    </div>
                </div>
                <div class="ui-form-row">
                    <div class="ui-form-label">
                        <div class="ui-ctl-label-text">Телефон</div>
                    </div>
                    <div class="ui-form-content">
                        <div class="ui-ctl ui-ctl-textbox ui-ctl-w100">
                            <input 
                                type="text" 
                                id="tel" 
                                class="ui-ctl-element tel" 
                                placeholder=""
                                name="PHONE"
                                required
                                >
                        </div>
                    </div>
                </div>
                <div class="ui-btn-container ui-btn-container-center">
                    <input
                            type="submit"
                            class="ui-btn ui-btn-success"
                            name="submit"
                            value="Сохранить"
                    >
                </div>
             </form>
        `
        return div
    }

}
