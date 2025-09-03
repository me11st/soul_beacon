from pyteal import *

def soul_beacon_contract():
    """
    Soul Beacon Smart Contract
    
    This contract manages the lifecycle of Soul Beacon ASA tokens:
    - Minting beacon tokens when users create "asks"
    - Managing token states (inactive/active)
    - Handling distributions based on matching outcomes
    - Managing expiry and protocol fees
    """
    
    # Global state keys
    beacon_creator = Bytes("creator")
    beacon_expiry = Bytes("expiry")
    beacon_matched = Bytes("matched")
    beacon_partner = Bytes("partner")
    beacon_ask_data = Bytes("ask_data")
    protocol_fee_addr = Bytes("protocol_addr")
    
    # Application arguments
    arg_create_beacon = Bytes("create_beacon")
    arg_match_beacons = Bytes("match_beacons")
    arg_distribute_tokens = Bytes("distribute")
    arg_expire_beacon = Bytes("expire")
    
    @Subroutine(TealType.uint64)
    def create_beacon_logic():
        """Create a new soul beacon ASA token"""
        return Seq([
            # Verify caller is authenticated
            Assert(Txn.sender() != Global.zero_address()),
            
            # Store beacon metadata
            App.globalPut(beacon_creator, Txn.sender()),
            App.globalPut(beacon_expiry, Global.latest_timestamp() + Int(15552000)),  # 6 months
            App.globalPut(beacon_matched, Int(0)),  # Not matched initially
            App.globalPut(beacon_ask_data, Txn.application_args[1]),
            
            # Create ASA token (inactive initially)
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.AssetConfig,
                TxnField.config_asset_total: Int(1000000),  # 1M microunits (1 token)
                TxnField.config_asset_decimals: Int(6),
                TxnField.config_asset_unit_name: Bytes("BEACON"),
                TxnField.config_asset_name: Bytes("Soul Beacon"),
                TxnField.config_asset_url: Bytes("https://soulbeacon.ai"),
                TxnField.config_asset_manager: Global.current_application_address(),
                TxnField.config_asset_reserve: Global.current_application_address(),
                TxnField.config_asset_freeze: Global.current_application_address(),
                TxnField.config_asset_clawback: Global.current_application_address(),
            }),
            InnerTxnBuilder.Submit(),
            
            Int(1)
        ])
    
    @Subroutine(TealType.uint64)
    def match_beacons_logic():
        """Match two beacons and activate them"""
        return Seq([
            # Verify only authorized matching service can call this
            Assert(Txn.sender() == App.globalGet(protocol_fee_addr)),
            
            # Mark as matched
            App.globalPut(beacon_matched, Int(1)),
            App.globalPut(beacon_partner, Txn.application_args[1]),
            
            # Activate the ASA (unfreeze for transfers)
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.AssetFreeze,
                TxnField.freeze_asset: Txn.assets[0],
                TxnField.freeze_asset_account: App.globalGet(beacon_creator),
                TxnField.freeze_asset_frozen: Int(0),  # Unfreeze
            }),
            InnerTxnBuilder.Submit(),
            
            Int(1)
        ])
    
    @Subroutine(TealType.uint64)
    def distribute_tokens_logic():
        """Distribute tokens based on match outcome"""
        matched = App.globalGet(beacon_matched)
        creator = App.globalGet(beacon_creator)
        protocol_addr = App.globalGet(protocol_fee_addr)
        
        return Seq([
            If(matched == Int(1))
            .Then(
                # Match found: 50% to each user, 50% to protocol
                Seq([
                    # Transfer 50% to creator
                    InnerTxnBuilder.Begin(),
                    InnerTxnBuilder.SetFields({
                        TxnField.type_enum: TxnType.AssetTransfer,
                        TxnField.xfer_asset: Txn.assets[0],
                        TxnField.asset_amount: Int(500000),  # 0.5 tokens
                        TxnField.asset_receiver: creator,
                    }),
                    InnerTxnBuilder.Submit(),
                    
                    # Transfer 50% to protocol
                    InnerTxnBuilder.Begin(),
                    InnerTxnBuilder.SetFields({
                        TxnField.type_enum: TxnType.AssetTransfer,
                        TxnField.xfer_asset: Txn.assets[0],
                        TxnField.asset_amount: Int(500000),  # 0.5 tokens
                        TxnField.asset_receiver: protocol_addr,
                    }),
                    InnerTxnBuilder.Submit(),
                ])
            )
            .Else(
                # No match: 70% back to user, 30% to protocol
                Seq([
                    # Transfer 70% back to creator
                    InnerTxnBuilder.Begin(),
                    InnerTxnBuilder.SetFields({
                        TxnField.type_enum: TxnType.AssetTransfer,
                        TxnField.xfer_asset: Txn.assets[0],
                        TxnField.asset_amount: Int(700000),  # 0.7 tokens
                        TxnField.asset_receiver: creator,
                    }),
                    InnerTxnBuilder.Submit(),
                    
                    # Transfer 30% to protocol
                    InnerTxnBuilder.Begin(),
                    InnerTxnBuilder.SetFields({
                        TxnField.type_enum: TxnType.AssetTransfer,
                        TxnField.xfer_asset: Txn.assets[0],
                        TxnField.asset_amount: Int(300000),  # 0.3 tokens
                        TxnField.asset_receiver: protocol_addr,
                    }),
                    InnerTxnBuilder.Submit(),
                ])
            ),
            Int(1)
        ])
    
    @Subroutine(TealType.uint64)
    def expire_beacon_logic():
        """Handle beacon expiry after 6 months"""
        return Seq([
            # Check if beacon has expired
            Assert(Global.latest_timestamp() > App.globalGet(beacon_expiry)),
            
            # If not matched, distribute tokens
            If(App.globalGet(beacon_matched) == Int(0))
            .Then(distribute_tokens_logic()),
            
            Int(1)
        ])
    
    # Main application logic
    program = Cond(
        [Txn.application_id() == Int(0), Int(1)],  # Creation
        [Txn.application_args[0] == arg_create_beacon, create_beacon_logic()],
        [Txn.application_args[0] == arg_match_beacons, match_beacons_logic()],
        [Txn.application_args[0] == arg_distribute_tokens, distribute_tokens_logic()],
        [Txn.application_args[0] == arg_expire_beacon, expire_beacon_logic()],
    )
    
    return program

if __name__ == "__main__":
    print(compileTeal(soul_beacon_contract(), Mode.Application, version=8))
