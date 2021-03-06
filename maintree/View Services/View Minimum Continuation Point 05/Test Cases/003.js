/*    Test 5.7.2-4 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given five nodes to browse
            And the nodes exist
            And each node has at least three forward references
            And RequestedMaxReferencesPerNode is 1
            And Browse has been called
          When BrowseNext is called
          Then the server returns the next reference
            And valid ContinuationPoint
          Validation is accomplished by first browsing all references on a node,
          then performing the test while comparing the appropriate references to the 
          references returned by each BrowseNext call. So this test only validates
          that Browse all references is consistent with Browse one reference
          followed by BrowseNexts. */

function TestBrowseNextOnMultipleNodes() {
    var nodeIdsToBrowse = [
        UaNodeId.fromString( readSetting( "/Server Test/NodeIds/References/Has 3 Forward References 1" ).toString() ),
        UaNodeId.fromString( readSetting( "/Server Test/NodeIds/References/Has 3 Forward References 2" ).toString() ),
        UaNodeId.fromString( readSetting( "/Server Test/NodeIds/References/Has 3 Forward References 3" ).toString() ),
        UaNodeId.fromString( readSetting( "/Server Test/NodeIds/References/Has 3 Forward References 4" ).toString() ),
        UaNodeId.fromString( readSetting( "/Server Test/NodeIds/References/Has 3 Forward References 5" ).toString() )
    ];
    var i;
    // check the settings are all good
    for( i=0; i<nodeIdsToBrowse.length; i++ ) {
        if( nodeIdsToBrowse[i] === undefined || nodeIdsToBrowse[i] === null ) {
            addSkipped( "[Configuration Issue?] Cannot execute test. Settings not configured 'Has 3 Forward References 1, 2, 3, 4 and/or 5'." );
            return( false );
        }
    }
    // get expected references
    var expectedReferences = GetDefaultReferencesFromNodeIds( Test.Session.Session, nodeIdsToBrowse );
    for( i = 0; i < expectedReferences.length; i++ ) {
        if( expectedReferences[i].length < 3 ) {
            addError( "Test cannot be completed: node does not have at least three references: " + nodeIdsToBrowse[i] );
            return( false );
        }
    }
    // Browse for first reference
    var firstResponse = GetBrowseResponseForOneReference( Test.Session.Session, nodeIdsToBrowse );
    if( firstResponse == -1 ) {
        return( false );
    }
    // BrowseNext
    var response = BrowseNextFromResponseAndAssertReferencesMatch( Test.Session.Session, expectedReferences, 1, 1, false, firstResponse.Results );
    // Validate that each ContinuationPoint is not empty
    var haveAllContinuationPoints = true;
    for( i = 0; i < response.Results.length; i++ ) {
        var result = response.Results[i];
        if( StatusCode.Good != result.StatusCode.StatusCode ) {
            addError( "StatusCode from BrowseNext is not Good when more references exist: " + result.StatusCode, result.StatusCode );
        }
        if( !Assert.False( result.ContinuationPoint.isEmpty(), "ContinuationPoint is empty when more references exist: " + result.ContinuationPoint ) ) {
            haveAllContinuationPoints = false;
        }
    }
    // BrowseNext again to validate ContinuationPoints were truly correct
    if( haveAllContinuationPoints ) {
        response = BrowseNextFromResponseAndAssertReferencesMatch( Test.Session.Session, expectedReferences, 2, 2, false, response.Results );
    }
    releaseContinuationPoints( Test.Session.Session, response );
    return( true );
}

Test.Execute( { Procedure: TestBrowseNextOnMultipleNodes } );