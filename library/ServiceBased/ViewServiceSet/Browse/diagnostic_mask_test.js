// generate an operation error and validate diagnostics
function TestBrowseOperationErrorDiagnosticMask( Session, returnDiagnosticMask ) {
    addLog( "Testing Browse operation error with RequestHeader.ReturnDiagnostics = " + returnDiagnosticMask );
    var nodeToBrowse = UaNodeId.fromString( readSetting( "/Advanced/NodeIds/Invalid/UnknownNodeId1" ).toString() );
    var request = GetDefaultBrowseRequest( Session, nodeToBrowse );
    var response = new UaBrowseResponse();
    request.RequestHeader.ReturnDiagnostics = returnDiagnosticMask;
    var uaStatus = Session.browse( request, response );
    // check result
    if( uaStatus.isGood() ) {
        var expectedOperationResultsArray = [1];
        expectedOperationResultsArray[0] = new ExpectedAndAcceptedResults();
        expectedOperationResultsArray[0].addExpectedResult( StatusCode.BadNodeIdUnknown );
        // relying on assertBrowseError to validate diagnostics (is that complete enough?)
        assertBrowseError( request, response, expectedOperationResultsArray );
    }
    else addError( "Browse() status " + uaStatus, uaStatus );
}


// generate service error and validate diagnostics
function TestBrowseServiceErrorDiagnosticMask( Session, returnDiagnosticMask ) {
    print( "Testing Browse service error with RequestHeader.ReturnDiagnostics = " + returnDiagnosticMask );
    var request = new UaBrowseRequest();
    var response = new UaBrowseResponse();
    Session.buildRequestHeader( request.RequestHeader );
    request.RequestHeader.ReturnDiagnostics = returnDiagnosticMask;
    var uaStatus = Session.browse( request, response );
    // check result
    if( uaStatus.isGood() ) {
        var expectedServiceResult = new ExpectedAndAcceptedResults( StatusCode.BadNothingToDo );
        UaResponseHeader.IsValid( { Service: { Name: "Browse", Request: request, Response: response }, ServiceResult: expectedServiceResult } );
    }
    else addError( "Browse() status " + uaStatus, uaStatus );
}