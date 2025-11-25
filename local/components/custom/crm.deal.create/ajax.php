<?php

if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) {
    die();
}

use Bitrix\Crm\ContactTable;
use Bitrix\Main\Engine\Controller;

Bitrix\Main\Loader::includeModule('crm');

class CrmDealCreateAjaxController extends Controller
{
    public function getContactsAction ($fio = ''): array
    {
        return ContactTable::query()
            ->addSelect('FULL_NAME')
            ->addSelect('ID')
            ->whereLike('FULL_NAME', "%{$fio}%")
            ->setLimit(5)
            ->fetchAll();
    }

    public function createContactAction ($contact): string|array
    {
        $arFields = [
            "NAME"        => $contact['NAME'],
            "LAST_NAME"   => $contact['LAST_NAME'],
            "SECOND_NAME" => $contact['SECOND_NAME'],
            "FM"          => [
                'PHONE' => [
                    'n0' => [
                        'VALUE'      => $contact["PHONE"],
                        'VALUE_TYPE' => 'WORK',
                    ],
                ],
            ],
        ];

        $contactObj = new CCrmContact(false);
        $contactId = $contactObj->add($arFields);

        if ($contactObj->LAST_ERROR != "") {
            throw new Exception($contactObj->LAST_ERROR);
        }

        return [
            'contactId' => $contactId,
        ];
    }

}
