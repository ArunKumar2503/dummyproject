/**
 * @createdBy <team@vectone.com>
 * @createdOn
 */

export const CALL = {
  UPDATE_IVR: '/update_ivr',
  SAVE_CALL_FLOW: '/savecallflow',
  UPDATE_CALL_FLOW: '/update_callflow',
  GET_CALL_FLOW_LIST: '/callflowlist',
  GET_CALL_FLOW_DETAILS: '/callflowdetails/:cfid',
  WEBHOOK: '/webhook',
  GET_AGENT_CALL_LIST: '/get_agent_call_list',
  GET_ALL_ACTIVE: '/get_all_active',
  GET_AGENT_CHAT_LIST: '/get_agent_chat_list',
  GET_SESSIONID_LIST: '/get_sessionid_list',
  GET_CALLBACK_LIST: '/get_callback_list',
  GET_VOICE_CALL_LIST: '/get_voice_call_list',
  ASSIGN_CALLBACK: '/assign_callback',
  GET_ACTIVITY_LIST: '/get_activity_list',
  GET_VOICE_CALLBACK_LIST: '/get_voice_callback_list',
  GET_SESSION_ALL_LIST: '/get_session_all_list',
  GET_CONVERSATION_LIST: '/get_conversation_list',
  GET_CALL_FLOW_DETAILS_BY_CFID: '/get_call_flow_details_by_cfid',
};

export const STATE = {
  CREATE_STATE: '/create_state',
  GET_SATATE_LIST_BY: '/get_state_list_by',
  UPDATE_STATE: '/update_state'
};

export const PROMPT = {
  FILEUPLOAD: '/chat_upload_file',
  UPLOADFILE: '/prompt_file_upload',
  GETAUDIOPROMPT: '/get_audio_prompt',
  GET_DEFAULT_AUDIO: '/get_default_audio',
  TEXT_TO_SPEECH: '/text_to_speech',
  INSERT_PROMPT_AUDIO: '/create_prompt_audio',
  GET_PROMPT_LIBRARY: '/get_prompt_audio_librar',
  CREATE_PROMPT: '/create_prompt',
  INSERT_AUDIO_PROMPT: '/insert_prompt_audio',
  GET_PROMPT_LIBRAR: '/get_prompt_audio_library',
  UPDATE_PROMPT_AUDIO: '/update_prompt_audio_library',
  DELETE_PROMPT_AUDIO: '/delete_prompt_audio',
  IS_VALID_PROMPT_NAME: '/is_valid_prompt_name',
  GET_PREVIEW_AUDIO: '/get_preview_audio'
};

export const CHAT = {
  UPDATE_CHAT: '/update_chat_session',
  GET_CHAT: '/get_chat_session',
  GET_CALL: '/get_call_session',
  GET_SESSION_ID: '/get_chatSessionId',
  GET_CHAT_BY_NUMBER: '/get_chatByNumber',
  GET_SESSION_BY_ENDTIME: '/get_chat_by_endTime',
};

export const WEBCHAT = {
  CREATE_WEBCHAT: '/create_chat_session',
  GET_CUSTOMER_HISTORY: '/get_customer_history',
  STORE_CUSTOMER_CALL_BACK: '/store_customer_callback',
  CREATE_CUSTOMER_UPLOAD: '/create_customer_file_upload',
  GET_CUSTOMER_HISTORY_EMAIL_ID: '/get_customer_history_emailid',
  GET_AGENT_DETAILS: '/get_agent_details'

};
export const CORE = {
  CREATE_INITIATE_FEEDBACK: '/create_initiate_feedback',
  GET_INITIATE_FEEDBACK: '/get_initiate_feedback'
};

export const QUEUE = {
  CREATE_QUEUE_WAIT_TIME: '/create_queue_wait_time',
  UPDATE_QUEUE_WAIT_TIME: '/update_queue_wait_time',
  DELETE_QUEUE_WAIT_TIME: '/delete_queue_wait_time',
  GET_QUEUE_WAIT_TIME: '/get_queue_wait_time',
  GET_ALL_QUEUE_WAIT_TIME: '/get_all_queue_wait_time'
};

export const DISPOSITION = {
  INSERT_DISPOSITION_STATUS: '/insert_disposition_status',
  GET_DISPOSITION_STATUS: '/get_disposition_status',
  UPDATE_DISPOSITION_STATUS: '/update_disposition_status',
  DELETE_DISPOSITION_STATUS: '/delete_disposition_status',
  IS_VALID_DISPOSITION_NAME: '/is_valid_disposition_name',
  UPDATE_DISPOSITION: '/update_disposition',
  UPDATE_CALLED_PERSON_DETAILS: '/update_called_person_details'
};

export const NOTIFICATION = {
  INSERT_NOTIFICATION: '/insert_notificationmsg',
  GET_NOTIFICATION: '/get_notification/:timestamp',
  DELETE_NOTIFICATION: '/delete_notification',
  UPDATE_MARKAS_READ: '/update_markasread'
};
export const RESPONSE = {
  update_initiate_feedback: 'update initiate successfully',
  not_found: 'No data found',
  internal_error: 'Internal server error',
  success_message: 'success',
  create_queue_waitTime: 'create queue waitTime successfully',
  update_queue_waitTime: 'update queue waitTime successfully',
  deleted_queue_waitTime_successfully: 'deleted_queue_waitTime_successfully',
  empty_data: 'Empty data',
  create_State: 'creating state successfully',
  User_update_state_success: 'user_update_state_success',
  update_asssign: 'update assign callback successfully',
  disposition_status: 'insert disposition status successfully',
  disposition_statuss: 'update disposition status successfully',
  dispositionn_statuss: 'delete disposition status successfully',
  did: 'did number should not be empty',
  available: 'available',
  name_already_exist: 'name already exist',
  notification_success_status: 'notification details insert successfully',
  notification_delete_status: 'Deleted successfully',
  update_markas_read: 'mark as read update successfully',
  valid_input: 'give the valid input'
};

export const EMAIL_CONSTANT = {
  GET_EMAIL_CHANNEL: '/get_email_channel',
  POST_EMAIL_CHANNEL: '/post_email_channel',
  DELETE_EMAIL_LIST: '/delete_email',
  UPDATE_EMAIL_PRIMARYKEY: '/update_primarykey',
  GET_INBOX_MAIL: '/get_inbox_mail',
  CREATE_EMAIL_SESSION: '/create_email_session'
};
