/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Test #002: Span the boundary when history starts. Vary the number of items in the response.
                            PercentDataGood=10; PercentDataBad=10. */

function aggregateTest() { 
    var result = true;
    var diff = OPCF.HA.Analysis.Find.Date.Average( { Debug: CUVariables.Debug,
                                                     Times: [ CUVariables.Items[0].RawValues.FirstRecord().SourceTimestamp,
                                                              OPCF.HA.Analysis.Find.Date.Next( { RawData: CUVariables.Items[0].RawValues, Skip: 5 } ).SourceTimestamp ] } );
    var startTime = CUVariables.Items[0].RawValues.FirstRecord().SourceTimestamp;
    var endTime = startTime.clone();
    startTime.addMilliSeconds( -diff );
    endTime.addSeconds( diff );

    var haparams = { 
          NodesToRead: CUVariables.Items[0],
          HistoryReadDetails: UaReadProcessedDetails.New( { 
                  StartTime: startTime, 
                  EndTime:   endTime,
                  ProcessingInterval: diff, 
                  AggregateType: CUVariables.Aggregate.Type,
                  AggregateConfiguration: UaAggregateConfiguration.New( { 
                          PercentDataGood: 10,
                          PercentDataBad:  10
                      } ) 
                  } ),
          TimestampsToReturn:    TimestampsToReturn.Source,
          ReleaseContinuationPoints: false,
          AggregateDefinition: CUVariables.Aggregate,
          OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadAggregateInvalidInputs ),
          Debug: CUVariables.Debug };


    // TEST ONE: First interval is completely before history
    if( CUVariables.Debug ) print( "\nTEST ONE...\n" );
    if( !Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead (Test #1) fail expected." ) ) result = false;


    // TEST TWO: First interval spans the boundary of the start value 
    if( CUVariables.Debug ) print( "\nTEST TWO...\n" );
    haparams.HistoryReadDetails.StartTime.addMilliSeconds( diff / 2 );
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead (Test #2) fail expected." ) ) result = false;


    // TEST THREE: Repeat test #2 but reverse the date order
    if( CUVariables.Debug ) print( "\nTEST THREE...\n" );
    var tmp = haparams.HistoryReadDetails.StartTime.clone();
    haparams.HistoryReadDetails.StartTime = haparams.HistoryReadDetails.EndTime.clone();
    haparams.HistoryReadDetails.EndTime = tmp.clone();
    if( Assert.True( HistoryReadHelper.Execute( haparams ), "HistoryRead (Test #3) fail expected." ) ) result = false;


    return( result );
} // function aggregateTest()

Test.Execute( { Procedure: aggregateTest } );