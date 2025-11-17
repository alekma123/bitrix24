>1. Компонент (/portal/local/components/custom/crm.deal.create/)

<img width="537" height="608" alt="image" src="https://github.com/user-attachments/assets/ce4d031b-283c-4c37-9626-15b4c701ea63" />

Пример подключения компонента на странице /a-page/index.php


>2.  js-расширение (/portal/local/js/crm-deal) 

<img width="506" height="586" alt="image" src="https://github.com/user-attachments/assets/7451ca77-54fa-4552-8c45-76723b225041" />

Пример уведомления

<img width="453" height="360" alt="image" src="https://github.com/user-attachments/assets/5c65716b-7f1f-49e2-893e-616c96177523" />


>3. Агент (/portal/local/php_interface/Agents/DealAgent.php)
<img width="662" height="469" alt="image" src="https://github.com/user-attachments/assets/24a9170b-6baa-412c-b12e-04ff999bc332" />

с логированием в /portal/local/php_interface_php/logs/agent.log

<img width="445" height="289" alt="image" src="https://github.com/user-attachments/assets/8b3f631f-4a9b-43c6-96c1-1b60e00d73d9" />

- ID - ID сделки
- OLD_STAGE_ID - id предыдущей стадии сделки 
- COMMENT_ID - id добавленного коммента к сделке 

   
   
>4. Обработчик (/portal/local/php_interface/EventHandlers/DealEventHandler.php)
 
c логированием в /portal/local/php_interface_php/logs/handler.log
 
<img width="1228" height="276" alt="image" src="https://github.com/user-attachments/assets/e30c844a-a300-469b-92d5-35bd386ccd7b" />

- ID - ID сделки
- NEW_STAGE - новый статус сделки 
- OLD_STAGE - предыдущий стату сделки
- MOVED_TIME -  когда была изменена стадия сделки
- UPDATED_BY_ID - кто изменил стадию сделки, id сотрудника
- UPDATED_BY_FULL_NAME - кто изменил стадию сделки, полное имя сотрудника
