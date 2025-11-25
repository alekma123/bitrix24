<?php

namespace EventHandlers;

use Bitrix\Main\EventManager;
use Bitrix\Main\Loader;
use Bitrix\Crm\DealTable;
use Bitrix\Main\UserTable;
use Bitrix\Main\Diag;

class DealEventHandler
{
    const LOG_FILE     = '/local/php_interface/logs/handler.log';
    const MAX_LOG_SIZE = 0;
    private array $lastStages = [];

    public function __construct ()
    {
        Loader::includeModule('crm');

        EventManager::getInstance()
            ->addEventHandler('crm', 'OnBeforeCrmDealUpdate', $this->saveOldStage(...));
        EventManager::getInstance()
            ->addEventHandler('crm', 'OnAfterCrmDealUpdate', $this->isChangedStage(...));
    }

    public function saveOldStage ($fields): void
    {
        $dealId = $fields['ID'];
        $oldDeal = DealTable::query()
            ->addSelect('STAGE_ID')
            ->addFilter('ID', $dealId)
            ->fetch();

        $this->lastStages[$dealId] = $oldDeal['STAGE_ID'];
    }

    public function isChangedStage ($fields): void
    {
        $newStage = $fields['STAGE_ID'];
        $dealId = $fields['ID'];
        $isNewStage = $newStage && $this->lastStages[$dealId] != $newStage;

        if ($isNewStage) {
            $this->writeLog($fields);
        }
    }

    private function getUserById (int $id): string
    {
        $user = UserTable::query()
            ->addSelect('ID')
            ->addSelect('NAME')
            ->addSelect('LAST_NAME')
            ->addFilter('ID', $id)
            ->fetch();

        return "${user['LAST_NAME']} {$user['NAME']}";
    }

    private function writeLog ($fields): void
    {
        $logger = new Diag\FileLogger($_SERVER['DOCUMENT_ROOT'] . self::LOG_FILE, self::MAX_LOG_SIZE);
        $message = "[ID: {ID}; NEW_STAGE:{NEW_STAGE}; OLD_STAGE:{OLD_STAGE}; MOVED_TIME:{MOVED_TIME}; UPDATED_BY_ID:{UPDATED_BY_ID}; UPDATED_BY_FULL_NAME:{UPDATED_BY_FULL_NAME}]; \n";

        $logger->info($message, [
            'ID'                   => $fields['ID'],
            'NEW_STAGE'            => $fields['STAGE_ID'],
            'OLD_STAGE'            => $this->lastStages[$fields['ID']],
            'MOVED_TIME'           => $fields['MOVED_TIME'],
            'UPDATED_BY_ID'        => $fields['MODIFY_BY_ID'],
            'UPDATED_BY_FULL_NAME' => $this->getUserById($fields['MODIFY_BY_ID']),
        ]);
    }

}
