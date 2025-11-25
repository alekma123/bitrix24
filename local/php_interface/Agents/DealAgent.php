<?php

namespace Agents;

use Bitrix\Crm\DealTable;
use Bitrix\Main\Type\DateTime;
use Bitrix\Crm\StatusTable;
use Bitrix\Main\Diag;
use Bitrix\Crm\Timeline\CommentEntry;
use Bitrix\Main\Loader;
use CCrmOwnerType;

Loader::IncludeModule('crm');

class DealAgent
{
    const LOG_FILE     = '/local/php_interface/logs/agent.log';
    const MAX_LOG_SIZE = 0;

    public static function setExpiredStage (): string
    {
        $query = DealTable::getList([
            'filter' => [
                '=STAGE_ID' => 'NEW',
                ['<DATE_CREATE' => (new DateTime())->add('-3 days')],
            ],
            'select' => [
                'ID',
                'TITLE',
                'DATE_MODIFY',
                'STAGE_ID',
            ],
        ]);

        $expiredStage = self::getExpiredStage();

        while ($deal = $query->fetchObject()) {
            $log['ID'] = $deal->getId();
            $log['OLD_STAGE_ID'] = $deal->getStageId();

            $deal->set('STAGE_ID', $expiredStage['ID']);
            $deal->save();

            $log['COMMENT_ID'] = self::addComment($deal->getId());

            self::writeLog($log);
        }

        return __CLASS__ . '::' . __FUNCTION__ . '();';
    }

    private static function writeLog ($data): void
    {
        $logger = new Diag\FileLogger($_SERVER['DOCUMENT_ROOT'] . self::LOG_FILE, self::MAX_LOG_SIZE);
        $message = "[ID: {ID}; OLD_STAGE_ID:{OLD_STAGE_ID}; COMMENT_ID:{COMMENT_ID} ]; \n";
        $logger->info($message, $data);
    }

    private static function getExpiredStage (): array
    {
        return StatusTable::query()
            ->addSelect('ID')
            ->addSelect('NAME')
            ->addSelect('STATUS_ID')
            ->addFilter('NAME', 'Просрочена')
            ->fetch();
    }

    private static function addComment (int $dealId): int|null
    {
        $comment = [

            'AUTHOR_ID' => 1,
            'TEXT'      => 'Автоматический перевод из-за просрочки',
            'BINDINGS'  => [
                [
                    'ENTITY_TYPE_ID' => CCrmOwnerType::Deal,
                    'ENTITY_ID'      => $dealId,
                ],
            ],

            'SETTINGS' => [
                'HAS_FILES' => 'N',
            ],
        ];

        $commentId = CommentEntry::create($comment);

        return $commentId;
    }

}
