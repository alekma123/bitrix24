<?php

use Bitrix\Main\Engine\Contract\Controllerable;
use Bitrix\Main\Errorable;
use Bitrix\Main\ErrorCollection;
use Bitrix\Crm\DealTable;

class CrmDealCreate extends CBitrixComponent
    implements Controllerable, Errorable
{
    protected $errorCollection;

    public function configureActions ()
    {
        return [];
    }

    public function onPrepareComponentParams ($params)
    {
        $this->errorCollection = new ErrorCollection();
    }

    public function createDealAction ($form)
    {
        CModule::IncludeModule('crm');
        global $USER;

        $result = DealTable::add([
            'TITLE'          => $form['TITLE'],
            'TYPE_ID'        => 'SALE',
            'STAGE_ID'       => 'NEW',
            'CURRENCY_ID'    => 'RUB',
            'OPPORTUNITY'    => $form['opportunity'],
            'CONTACT_ID'     => $form['contact_id'],
            'COMMENTS'       => $form['description'],
            'CREATED_BY_ID'  => $USER->GetID(),
            'MODIFY_BY_ID'   => $USER->GetID(),
            'ASSIGNED_BY_ID' => $USER->GetID(),
        ]);

        if (!$result->isSuccess()) {
            throw new Exception($result->getErrorMessages()[0]);
        }

        return ['dealId' => $result->getId()];
    }

    public function executeComponent ()
    {
        $this->includeComponentTemplate();
    }

    public function getErrors ()
    {
        return $this->errorCollection->toArray();
    }

    public function getErrorByCode ($code)
    {
        return $this->errorCollection->getErrorByCode($code);
    }
}
