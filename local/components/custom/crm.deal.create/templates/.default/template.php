<div class="container-deal">

    <div class="deal-caption">
        <h1>Создание сделки</h1>
    </div>

    <div class="deal-message" id="result-create-deal">
        <div class="ui-alert ui-alert-primary">
            <span class="ui-alert-message"></span>
        </div>
    </div>

    <div class="deal-content">
        <form class="ui-form" id="from-deal-create">
            <div class="ui-form-row">
                <div class="ui-form-label">
                    <div class="ui-ctl-label-text">Название</div>
                </div>
                <div class="ui-form-content">
                    <div class="ui-ctl ui-ctl-textbox ui-ctl-w100">
                        <input
                                name="title"
                                type="text"
                                class="ui-ctl-element"
                                placeholder="Сделка #"
                                required
                        >
                    </div>
                </div>
            </div>
            <div class="ui-form-row">
                <div class="ui-form-label">
                    <div class="ui-ctl-label-text" id="contact">Контакт (поиск по ФИО)</div>
                </div>
                <div class="ui-form-content">
                    <div class="ui-ctl ui-ctl-textbox ui-ctl-w100">
                        <input
                                id="fio"
                                type="text"
                                class="ui-ctl-element"
                                placeholder=""
                                value=""
                                data-id=""
                                required
                        >
                    </div>
                </div>
            </div>
            <div class="ui-form-row">
                <div class="ui-form-label">
                    <div class="ui-ctl-label-text">Сумма</div>
                </div>
                <div class="ui-form-content">
                    <div class="ui-ctl ui-ctl-textbox ui-ctl-w100">
                        <input
                                name="opportunity"
                                type="number"
                                class="ui-ctl-element"
                                placeholder="Сумма"
                                min = "0"
                                required
                        >
                    </div>
                </div>
            </div>
            <div class="ui-form-row">
                <div class="ui-form-label">
                    <div class="ui-ctl-label-text">Описание </div>
                </div>
                <div class="ui-ctl ui-ctl-textarea">
                    <textarea
                            name="description"
                            class="ui-ctl-element ui-ctl-resize-y"
                    ></textarea>
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
    </div>
</div>



<?php

\Bitrix\Main\UI\Extension::load("ui.forms");
\Bitrix\Main\UI\Extension::load("ui.layout-form");
\Bitrix\Main\UI\Extension::load('ui.entity-selector');
\Bitrix\Main\UI\Extension::load("ui.buttons");

\Bitrix\Main\UI\Extension::load('custom.crm-deal');
?>

<script>

    BX.ready(function(){
        let crmDeal = new BX.Custom.Crmdeal({
            'targetNode': document.getElementById('fio')
        })
        crmDeal.init()

        BX.Crm.Deal.Create.init()

    })



</script>
