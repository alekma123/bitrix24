<?php

use Bitrix\Main;
use Bitrix\Crm\DealTable;
use Bitrix\Main\Localization\Loc;
use Bitrix\Main\Error;
use Bitrix\Main\ErrorCollection;

if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

class CrmDealCreate extends \CBitrixComponent
    implements \Bitrix\Main\Engine\Contract\Controllerable, \Bitrix\Main\Errorable
{
    protected $errorCollection;
    public function configureActions()
    {
        return [];
    }
    public function onPrepareComponentParams($params)
    {
        $this->errorCollection = new ErrorCollection();
    }

    public function createDealAction_off($form)
    {
        CModule::IncludeModule('crm');
        global $USER;

        $arFields = [
            "TITLE" => $form["title"],
            "COMMENTS" => $form["description"],
            "OPPORTUNITY" => $form["opportunity"],
            "CURRENCY_ID" => "RUB",
            "CONTACT_ID" => $form["contact_id"],
            "STAGE_ID" => "NEW",
            "OPENED" => "Y",
            "CREATED_BY_ID" => $USER->GetID(),
        ];

        $options = [
            'CURRENT_USER' => $USER->GetID()
        ];
        $deal = new CCrmDeal(false);
        $dealId = $deal->Add($arFields,true,$options);

        return ['deal_id' => $dealId];
    }

    public function createDealAction($form)
    {
        CModule::IncludeModule('crm');
        global $USER;

        $result = DealTable::add([
            'TITLE' => $form['TITLE'],
            'TYPE_ID' => 'SALE',
            'STAGE_ID' => 'NEW',
            'CURRENCY_ID' => 'RUB',
            'OPPORTUNITY' => $form['opportunity'],
            'CONTACT_ID' => $form['contact_id'],
            'COMMENTS' => $form['description'],
            'CREATED_BY_ID' => $USER->GetID(),
            'MODIFY_BY_ID' => $USER->GetID(),
            'ASSIGNED_BY_ID' => $USER->GetID()
        ]);

        if (!$result->isSuccess()) {
            throw new \Exception($result->getErrorMessages()[0]);
        }
        return ['dealId' => $result->getId()];

    }
    public function executeComponent()
    {
        $this->includeComponentTemplate();
    }


    public function getErrors()
    {
        return $this->errorCollection->toArray();
    }

    public function getErrorByCode($code)
    {
        return $this->errorCollection->getErrorByCode($code);
    }
}