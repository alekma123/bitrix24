<?php

require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");

$APPLICATION->IncludeComponent("custom:crm.deal.create", "", []);

require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php");