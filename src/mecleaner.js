/**
 * MediaElement Cleaner
 * 1. Expand MediaElementPlayer class, add dispose() method which allows you properly
 * remove media element from DOM tree, delete the reference in mejs.players 
 * 2. Automatically call to dispose method when audio player is removed from dom tree.
 */
(function(mejs, $){

    var ARRAY_PROTO = Array.prototype;
    var SLICE = ARRAY_PROTO.slice;

    if (!mejs){
        return;
    }
    
    /**
     * Dispose current media element
     */
    mejs.MediaElementPlayer.prototype.dispose = function(){
        var me = this;
        
        if (me.__disposed){
            return;
        }
        
        var players = mejs.players, divParent;
        
        if (me.media.pluginType == 'flash'){
            // properly dispose the <object /> wrapping div
            divParent = me.media.pluginElement.parentNode;
        }
        
        try{
            me.remove();
        }
        catch(ex){}
        
        for(var l = players.length; l--;){
            if (players[l] === this){ 
                players.splice(l, 1);
                break;
            }
        }
        
        if (divParent && divParent.parentNode){
            divParent.parentNode.removeChild(divParent);
        }
        
        // check if the empty wrapp element is there
        if (this.media && this.media.parentNode){
            this.media.parentNode.removeChild(this.media);
        }
        
        if (this.node){
            try{
                this.node.removeAttribute('player');
            }
            catch(ex){}
        }
        
        me.__disposed = true;
    }
     
    // expand jQuery only if it is available   
    if (!$){
        return; 
    }
 
    var eventName = '__mejs_hack_dispose_on_removal';     
    var pluginMethod = $.fn.mediaelementplayer;
    var MediaElementPlayer = mejs.MediaElementPlayer;

    mejs.MediaElementPlayer = function MediaElementPlayerWrapper(){
        
        mejs.MediaElementPlayer = MediaElementPlayer;
        var ret = MediaElementPlayer.apply(null, arguments);
        mejs.MediaElementPlayer = MediaElementPlayerWrapper;

        if (ret.node){
            $(ret.node).bind(eventName, $.noop);
        }

        return ret;
    };
 
    $.event.special[eventName] = {
        /**
         * @param data (Anything) Whatever eventData (optional) was passed in
         *        when binding the event.
         * @param namespaces (Array) An array of namespaces specified when
         *        binding the event.
         * @param eventHandle (Function) The actual function that will be bound
         *        to the browser’s native event (this is used internally for the
         *        beforeunload event, you’ll never use it).
         */
        setup : function onActionSetup(data, namespaces, eventHandle) {
        },
        
        /**
         * @param namespaces (Array) An array of namespaces specified when
         *        binding the event.
         */
        teardown : function onActionTeardown(namespaces) {
            var player = this.player; 
            if (player){
                // settimeout to make sure the disposing happen after
                // the traversing of jquery, so it doesn't interfere 
                setTimeout(function(){
                    player.dispose();
                },0);
            }
        }         
    };
    
    
})(window.mejs, window.jQuery);