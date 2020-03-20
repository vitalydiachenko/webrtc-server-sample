enum SocketEvent {
  AddUserToList = 'add-user-to-list',
  AnswerMade = 'answer-made',
  CallEnded = 'call-ended',
  CallMade = 'call-made',
  CallUser = 'call-user',
  EndCall = 'end-call',
  IceReceived = 'ice-received',
  MakeAnswer = 'make-answer',
  RemoveUserFromList = 'remove-user-from-list',
  SendIceCandidate = 'send-ice-candidate',
  UpdateUsersList = 'update-users-list',
}

export default SocketEvent;
