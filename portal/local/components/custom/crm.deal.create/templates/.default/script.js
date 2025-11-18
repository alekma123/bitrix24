BX.namespace('BX.Crm.Deal.Create');
BX.Crm.Deal.Create = {

    init: function(){
        this.createAction();
    },

    showMessage: function(text, type) {

        let message = document.getElementById('result-create-deal')
        let textMessage = message.querySelector('.ui-alert')

        if (type === 'success') {
            textMessage.classList.replace('ui-alert-warning', 'ui-alert-primary')
        } else {
            textMessage.classList.replace('ui-alert-primary', 'ui-alert-warning')
        }

        message.querySelector('.ui-alert-message').innerHTML = text
        message.style.display = 'block'
    },

    createDeal: function(data) {

        BX.ajax.runComponentAction('custom:crm.deal.create', 'createDeal', {
            mode: 'class',
            data: {
                form: data
            },
            type: 'POST',
            dataType: 'json',
            enctype: 'multipart/form-data'

        }).then(function (response) {

            if (response.data['dealId']) {

                let href = `/crm/deal/details/${response.data['dealId']}/`
                let link = `<a href='${href}' target="_blank"> ${href} </a>`
                const text = `Сделка создана: ${link}`
                this.showMessage(text, 'success')
            }

        }.bind(this), function (response) {

            this.showMessage( response.errors[0].message , 'error')

        }.bind(this));

    },

    createAction: function(){

        let form = document.getElementById('from-deal-create')

        form.addEventListener('submit', function(event) {

            event.preventDefault();
            let formData = new FormData(event.target);
            formData.set('contact_id', form.fio.dataset['id'])
            this.createDeal( Object.fromEntries(formData.entries()) )

        }.bind(this));
    },

}
