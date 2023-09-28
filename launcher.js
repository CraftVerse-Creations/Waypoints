const Setting = {
    enabled: true,
    local_mode: false,
}
__config__.checkAndRestore(Setting);

ConfigureMultiplayer({
	isClientOnly: __config__.getBool("local_mode")
});

Launch()