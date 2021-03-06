/*  Test 4 prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Enables 5 subscriptions that were previously marked as Disabled. */

function setPublishingMode5103013()
{
    var subscriptions = [ 
        new Subscription( null, false ), 
        new Subscription( null, false ), 
        new Subscription( null, false ), 
        new Subscription( null, false ), 
        new Subscription( null, false ) ];

    var publishCount = subscriptions.length * 2;
    var allItems     = [];
    var i;

    for( i=0; i<subscriptions.length; i++ ) {
        if( CreateSubscriptionHelper.Execute( { Subscription: subscriptions[i] } ) ) {
            // add some monitored items our subscriptions
            var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
            if( !CreateMonitoredItemsHelper.Execute( { ItemsToCreate: items, TimestampsToReturn: TimestampsToReturn.Both, SubscriptionId: subscriptions[i] } ) ) return( false );
            allItems[i] = items;
        }
    }

    // now to call Publish() on all of these subscriptions to make sure that
    // we are NOT receiving any data change notifications...
    addLog( "call Publish() to make sure that we are NOT receiving data for enabled subscriptions." );
    for( i=0; i<publishCount; i++ ) {
        PublishHelper.Execute( { NoAcks: true } ); //do not acknowledge any subscriptions
    }

    // now check which subscriptions provided dataChanges
    AssertSubscriptionCallbacks( subscriptions, PublishHelper );

    // set publishing mode, ENABLE ALL subscriptions
    if( SetPublishingModeHelper.Execute( { SubscriptionIds: subscriptions, PublishingEnabled: true } ) ) {
        // write to the monitoredItem
        for( i=0; i<allItems.length; i++ ) {
            GenerateScalarValue( allItems[i].Value.Value, UaNodeId.GuessType( allItems[i].NodeSetting ), 13 );
        }
        WriteHelper.Execute( { NodesToWrite: allItems } );

        // we'll call Publish() a number of times to see if we do NOT get data changes
        // for any of our subscriptions.
        addLog( "\nPublish to be called now a maximum of " + publishCount + " times....NO DATACHANGES EXPECTED!" );
        for( var s=0; s<publishCount; s++ ) {
            PublishHelper.Execute( { NoAcks: true } );
        }//for s...
    }//SetPublishingModeHelper

    // now check which subscriptions provided dataChanges
    AssertSubscriptionCallbacks( subscriptions, PublishHelper );

    // delete all subscriptions added above
    for( i=0; i<subscriptions.length; i++ ) {
        DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: allItems[i], SubscriptionId: subscriptions[i] } )
        DeleteSubscriptionsHelper.Execute( { SubscriptionIds: subscriptions[i] } );
    }
    // clear the publish object's properties...
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: setPublishingMode5103013 } );