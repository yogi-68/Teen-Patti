var io = require('socket.io');
var _ = require('underscore');
var deck = require('./deck');
var DAL = require('./dal');
var tables = require('./tabledecks');


function Io() {
    return {
        init: function(server) {
            var objServ = io.listen(server);
            var table = tables.createNewTable(1);
            console.log('🎮 New game table created (Boot: 1, Players: 0)');
            
            // Timer management
            var turnTimers = {};
            var turnCountdowns = {};
            var TURN_TIMEOUT = 20000; // 20 seconds
            
            function clearTurnTimer(playerId) {
                if (turnTimers[playerId]) {
                    clearTimeout(turnTimers[playerId]);
                    delete turnTimers[playerId];
                }
                if (turnCountdowns[playerId]) {
                    clearInterval(turnCountdowns[playerId]);
                    delete turnCountdowns[playerId];
                }
            }
            
            function startTurnTimer(player, playerClient) {
                clearTurnTimer(player.id);
                
                var timeLeft = 20; // seconds
                
                console.log('⏰ Starting 20s timer for player:', player.playerInfo.userName, '(ID:', player.id + ')');
                
                // Emit initial timer
                playerClient.emit('turnTimer', { playerId: player.id, timeLeft: timeLeft });
                playerClient.broadcast.emit('turnTimer', { playerId: player.id, timeLeft: timeLeft });
                
                // Countdown interval (updates every second)
                turnCountdowns[player.id] = setInterval(function() {
                    timeLeft--;
                    if (timeLeft >= 0) {
                        console.log('⏱️  Timer update:', player.playerInfo.userName, '→', timeLeft, 'seconds');
                        playerClient.emit('turnTimer', { playerId: player.id, timeLeft: timeLeft });
                        playerClient.broadcast.emit('turnTimer', { playerId: player.id, timeLeft: timeLeft });
                    }
                }, 1000);
                
                // Timeout action after 20 seconds
                turnTimers[player.id] = setTimeout(function() {
                    console.log('⏰ Turn timeout for player:', player.id);
                    
                    // Stop countdown
                    clearInterval(turnCountdowns[player.id]);
                    delete turnCountdowns[player.id];
                    
                    // Auto-bet with minimum amount (blind or chaal)
                    var tableInfo = table.getTableInfo();
                    var minBet = tableInfo.lastBet;
                    var isBlind = player.cardSet && player.cardSet.closed;
                    
                    // Check if player has enough chips
                    if (player.playerInfo.chips >= minBet) {
                        var players = table.placeBet(player.id, minBet, isBlind, player.playerInfo._id);
                        
                        if (players) {
                            var betAction = {
                                action: isBlind ? "Blind (Auto)" : "Chaal (Auto)",
                                amount: minBet,
                                blind: isBlind
                            };
                            
                            playerClient.emit('betPlaced', {
                                bet: betAction,
                                placedBy: player.id,
                                players: players,
                                table: table.getTableInfo(),
                                autobet: true
                            });
                            playerClient.broadcast.emit('betPlaced', {
                                bet: betAction,
                                placedBy: player.id,
                                players: players,
                                table: table.getTableInfo(),
                                autobet: true
                            });
                            
                            // Start timer for next player
                            for (var playerId in players) {
                                if (players[playerId].turn) {
                                    console.log('⏰ Starting 20s timer for next player:', playerId);
                                    startTurnTimer(players[playerId], playerClient);
                                    break;
                                }
                            }
                        }
                    } else {
                        // Auto-pack if not enough chips
                        console.log('⏰ Auto-pack (insufficient chips)');
                        var players = table.packPlayer(player.id);
                        playerClient.emit('playerPacked', {
                            bet: { lastAction: "Packed (Auto - timeout)", lastBet: "" },
                            placedBy: player.id,
                            players: players,
                            table: table.getTableInfo(),
                            autopack: true
                        });
                        playerClient.broadcast.emit('playerPacked', {
                            bet: { lastAction: "Packed (Auto - timeout)", lastBet: "" },
                            placedBy: player.id,
                            players: players,
                            table: table.getTableInfo(),
                            autopack: true
                        });
                        
                        // Start timer for next player
                        for (var playerId in players) {
                            if (players[playerId].turn) {
                                console.log('⏰ Starting 20s timer for next player:', playerId);
                                startTurnTimer(players[playerId], playerClient);
                                break;
                            }
                        }
                    }
                    
                    clearTurnTimer(player.id);
                }, TURN_TIMEOUT);
            }
            
            objServ.sockets.on('connection', function(client) {
                // var playerInfo = DAL.db.users.find({_id:Object(client.id)})
                client.on('joinTable', function(args) {
                    var addedPlayer = table.addPlayer({
                        id: client.id,
                        cardSet: {
                            closed: true
                        },
                        playerInfo: args
                    }, client);
                    console.log('now player count is:' + table.getActivePlayers());
                    if (addedPlayer !== false) {
                        var newPlayer = {
                            id: client.id,
                            tableId: table.gid,
                            slot: addedPlayer.slot,
                            active: addedPlayer.active,
                            packed: addedPlayer.packed,
                            playerInfo: args,
                            cardSet: addedPlayer.cardSet,
                            otherPlayers: table.getPlayers()
                        };
                        client.emit('tableJoined', newPlayer);
                        client.broadcast.emit('newPlayerJoined', newPlayer);
                        startNewGameOnPlayerJoin();
                    }
                });
                client.emit('connectionSuccess', {
                    id: client.id,
                    tableId: table.gid
                });
                console.log('🔌 Client connected:', client.id);
                client.on('seeMyCards', function(args) {
                    console.log(args)
                    var cardsInfo = table.getCardInfo()[args.id].cards;
                    table.updateSideShow(args.id);
                    client.emit('cardsSeen', {
                        cardsInfo: cardsInfo,
                        players: table.getPlayers()
                    });
                    client.broadcast.emit('playerCardSeen', {
                        id: args.id,
                        players: table.getPlayers()
                    });
                });

                client.on('placePack', function(args) {
                    // Clear timer for current player
                    clearTurnTimer(args.player.id);
                    
                    var players = table.packPlayer(args.player.id);
                    if (table.getActivePlayers() === 1) {
                        table.decideWinner();
                        client.emit('showWinner', {
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo(),
                            packed: true

                        });
                        client.broadcast.emit('showWinner', {
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo(),
                            packed: true
                        });
                        table.stopGame();
                        startNewGame();

                    } else {
                        client.emit('playerPacked', {
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo()
                        });
                        client.broadcast.emit('playerPacked', {
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo()
                        });
                        
                        // Start timer for next player's turn
                        for (var playerId in players) {
                            if (players[playerId].turn) {
                                console.log('⏰ Starting 20s timer for next player:', playerId);
                                startTurnTimer(players[playerId], client);
                                break;
                            }
                        }
                    }


                });

                function startNewGameOnPlayerJoin() {
                    if (table.getPlayersCount() >= 2 && !table.gameStarted) {
                        setTimeout(function() {
                            client.emit('gameCountDown', {
                                counter: 7
                            });
                            client.broadcast.emit('gameCountDown', {
                                counter: 7
                            });
                        }, 1000);
                        setTimeout(function() {
                            if (table.getPlayersCount() >= 2 && !table.gameStarted) {
                                table.startGame();
                                var sentObj = {
                                    players: table.getPlayers(),
                                    table: table.getTableInfo()
                                };
                                client.emit('startNew', sentObj);
                                client.broadcast.emit('startNew', sentObj);
                                
                                // Start timer for first player's turn
                                var players = table.getPlayers();
                                for (var playerId in players) {
                                    if (players[playerId].turn) {
                                        console.log('⏰ Starting 20s timer for player:', playerId);
                                        startTurnTimer(players[playerId], client);
                                        break;
                                    }
                                }
                            } else if (table.getPlayersCount() == 1 && !table.gameStarted) {
                                client.emit('notification', {
                                    message: 'Please wait for more players to join',
                                    timeout: 4000
                                });
                                client.broadcast.emit('notification', {
                                    message: 'Please wait for more players to join',
                                    timeout: 4000
                                });
                            }
                        }, 9000);
                    } else if (table.getPlayersCount() == 1 && !table.gameStarted) {
                        client.emit('notification', {
                            message: 'Please wait for more players to join',
                            timeout: 4000
                        });
                        client.broadcast.emit('notification', {
                            message: 'Please wait for more players to join',
                            timeout: 4000
                        });
                    }
                }

                function startNewGame(after) {
                    if (table.getPlayersCount() >= 2 && !table.gameStarted) {
                        setTimeout(function() {
                            client.emit('gameCountDown', {
                                counter: 9
                            });
                            client.broadcast.emit('gameCountDown', {
                                counter: 9
                            });
                        }, after || 6000);
                        setTimeout(function() {
                            if (table.getPlayersCount() >= 2 && !table.gameStarted) {
                                table.startGame();
                                var sentObj = {
                                    players: table.getPlayers(),
                                    table: table.getTableInfo()
                                };
                                client.emit('startNew', sentObj);
                                client.broadcast.emit('startNew', sentObj);
                                
                                // Start timer for first player's turn
                                var players = table.getPlayers();
                                for (var playerId in players) {
                                    if (players[playerId].turn) {
                                        console.log('⏰ Starting 20s timer for player:', playerId);
                                        startTurnTimer(players[playerId], client);
                                        break;
                                    }
                                }
                            } else if (table.getPlayersCount() == 1) {
                                client.emit('notification', {
                                    message: 'Please wait for more players to join',
                                    timeout: 4000
                                });
                                client.broadcast.emit('notification', {
                                    message: 'Please wait for more players to join',
                                    timeout: 4000
                                });
                                // setTimeout(function() {
                                table.reset();
                                var sentObj = {
                                    players: table.getPlayers(),
                                    table: table.getTableInfo()
                                };
                                client.emit('resetTable', sentObj);
                                client.broadcast.emit('resetTable', sentObj);
                                // }, 7000);
                            }
                        }, 13000);
                    } else if (table.getPlayersCount() == 1) {
                        setTimeout(function() {
                            client.emit('notification', {
                                message: 'Please wait for more players to join',
                                timeout: 4000
                            });
                            client.broadcast.emit('notification', {
                                message: 'Please wait for more players to join',
                                timeout: 4000
                            });
                        }, 4000);
                        setTimeout(function() {
                            table.reset();
                            var sentObj = {
                                players: table.getPlayers(),
                                table: table.getTableInfo()
                            };
                            client.emit('resetTable', sentObj);
                            client.broadcast.emit('resetTable', sentObj);
                        }, 4000);
                    }
                }

                client.on('placeBet', function(args) {
                    // Clear timer for current player
                    clearTurnTimer(args.player.id);
                    
                    var players = table.placeBet(args.player.id, args.bet.amount, args.bet.blind, args.player.playerInfo._id);
                    if (args.bet.show || table.isPotLimitExceeded()) {
                        args.bet.show = true;
                        var msg = table.decideWinner(args.bet.show);
                        client.emit('showWinner', {
                            message: msg,
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo(),
                            potLimitExceeded: table.isPotLimitExceeded()
                        });
                        client.broadcast.emit('showWinner', {
                            message: msg,
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo(),
                            potLimitExceeded: table.isPotLimitExceeded()
                        });
                        table.stopGame();
                        startNewGame();
                    } else {
                        client.emit('betPlaced', {
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo()

                        });
                        client.broadcast.emit('betPlaced', {
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo()
                        });
                        
                        // Start timer for next player's turn
                        for (var playerId in players) {
                            if (players[playerId].turn) {
                                console.log('⏰ Starting 20s timer for next player:', playerId);
                                startTurnTimer(players[playerId], client);
                                break;
                            }
                        }
                    }
                });

                client.on('respondSideShow', function(args) {
                    var players = table.getPlayers(),
                        msg = "";
                    table.resetSideShowTurn();
                    if (args.lastAction === "Denied") {
                        table.setNextPlayerTurn();
                        table.sideShowDenied(args.player.id);
                        msg = [args.player.playerInfo.userName, ' has denied side show'].join('');
                        client.emit('sideShowResponded', {
                            message: msg,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo()
                        });
                        client.broadcast.emit('sideShowResponded', {
                            message: msg,
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo()
                        });

                    } else if (args.lastAction === "Accepted") {
                        table.setNextPlayerTurn();
                        msg = table.sideShowAccepted(args.player.id);
                        client.emit('sideShowResponded', {
                            message: msg.message,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo()
                        });
                        client.broadcast.emit('sideShowResponded', {
                            message: msg.message,
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo()
                        });
                    }
                });
                client.on('placeSideShow', function(args) {
                    var sideShowMessage = table.placeSideShow(args.player.id, args.bet.amount, args.bet.blind, args.player.playerInfo._id);
                    var players = table.getPlayers();
                    if (table.isPotLimitExceeded()) {
                        args.bet.show = true;
                        var msg = table.decideWinner(args.bet.show);
                        client.emit('showWinner', {
                            message: msg,
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo(),
                            potLimitExceeded: table.isPotLimitExceeded()
                        });
                        client.broadcast.emit('showWinner', {
                            message: msg,
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo(),
                            potLimitExceeded: table.isPotLimitExceeded()
                        });
                        table.stopGame();
                        startNewGame();
                    } else {
                        client.emit('sideShowPlaced', {
                            message: sideShowMessage,
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo()

                        });
                        client.broadcast.emit('sideShowPlaced', {
                            message: sideShowMessage,
                            bet: args.bet,
                            placedBy: args.player.id,
                            players: players,
                            table: table.getTableInfo()
                        });
                    }
                });

                client.on('disconnect', function() {
                    // Clear any timer for disconnecting player
                    clearTurnTimer(client.id);
                    
                    if (table.gameStarted && table.isActivePlayer(client.id)) {
                        table.packPlayer(client.id);
                    }
                    var removedPlayer = table.removePlayer(client.id);
                    console.log('disconnect for ' + client.id);
                    console.log('total players left:' + table.getActivePlayers());
                    
                    // Only broadcast if player was actually in the table
                    if (removedPlayer) {
                        client.broadcast.emit('playerLeft', {
                            bet: {
                                lastAction: "Packed",
                                lastBet: ""
                            },
                            removedPlayer: removedPlayer,
                            placedBy: removedPlayer.id,
                            players: table.getPlayers(),
                            table: table.getTableInfo()
                        });
                        
                        if (table.getActivePlayers() == 1 && table.gameStarted) {
                            table.decideWinner();
                            client.emit('showWinner', {
                                bet: {
                                    lastAction: "Packed",
                                    lastBet: ""
                                },
                                placedBy: removedPlayer.id,
                                players: table.getPlayers(),
                                table: table.getTableInfo(),
                                packed: true

                            });
                            client.broadcast.emit('showWinner', {
                                bet: {
                                    lastAction: "Packed",
                                    lastBet: ""
                                },
                                placedBy: removedPlayer.id,
                                players: table.getPlayers(),
                                table: table.getTableInfo(),
                                packed: true
                            });
                            table.stopGame();
                            startNewGame();
                        }
                    }
                });
            });

        }
    }

}
module.exports = new Io();