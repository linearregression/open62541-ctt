/* Includes: 
    UaWriteMask: (enumeration, ToString, ToArray, and ToItems) helpers. */

UaWriteMask = {    // part 3, section 5.2.7 WriteMask.
    AccessLevel:     1,
    ArrayDimensions: 2,
    BrowseName:      4,
    ContainsNoLoops: 8,
    DataType:        16,
    Description:     32,
    DisplayName:     64,
    EventNotifier:   128,
    Executable:      256,
    Historizing:     512,
    InverseName:     1024,
    IsAbstract:      2048,
    MinimumSamplingInterval: 4096,
    NodeClas:        8192,
    NodeId:          16384,
    Symmetric:       32768,
    UserAccessLevel: 65536,
    UserExecutable:  131072,
    UserWriteMask:   262144,
    ValueRank:       524288,
    WriteMask:       1048576,
    ValueForVariableType: 2097152,

    ToString: function( value ) {
        var s = "";                                                  // string variable placeholder
        for( var v in this ) if( this[v] & value ) s += v + ",";     // iterate through each reflective property to find a match of the value
        return( s.substring( 0, s.length - 1 ) );                    // return the string, even if empty
    },
    ToArray: function( value ) {
        items = [];
        if( value !== undefined && value !== null ) {
            for( var v in this ) {
                if( this[v] & value )  {
                    for( var a in Attribute ) {
                        if( a === v ) {
                            items.push( Attribute[a] );
                            break;
                        }
                    }
                }
            }
        }
        return( items );
    },
    ToItems: function( args ) {
        var items = [], h = 0;
        if( args !== undefined && args !== null ) {
            var atts = this.ToArray( args.Value );
            for( a in atts ) items.push( new MonitoredItem( args.NodeId, h++, atts[a] ) );
        }
        return( items );
    }
}