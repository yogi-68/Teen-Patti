// Lobby Angular App
var app = angular.module('TeenPattiLobby', []);

app.controller('LobbyController', ['$scope', '$window', function($scope, $window) {
    $scope.rooms = [
        {
            id: 'default',
            name: 'Main Room',
            boot: 1,
            maxPlayers: 5,
            playerCount: 0,
            status: 'waiting'
        }
    ];
    
    $scope.playerInfo = {
        userName: 'Guest',
        chips: 0
    };
    
    $scope.newRoom = {
        name: '',
        boot: 10,
        maxPlayers: 5
    };
    
    // Get player info from localStorage
    var storedPlayer = localStorage.getItem('playerInfo');
    if (storedPlayer) {
        try {
            $scope.playerInfo = JSON.parse(storedPlayer);
        } catch(e) {
            console.log('Error parsing player info:', e);
        }
    }
    
    // Also try to get from rootScope if coming from game menu
    if (window.userInfo) {
        $scope.playerInfo = window.userInfo;
    }
    
    // Join room
    $scope.joinRoom = function(roomId) {
        localStorage.setItem('currentRoom', roomId);
        $window.location.href = '/startup';
    };
    
    // Create room button (disabled for now)
    $scope.createRoom = function() {
        alert('Room creation coming soon! For now, join the Main Room.');
    };
    
    // Spectate room (disabled for now)
    $scope.spectateRoom = function(roomId) {
        alert('Spectate mode coming soon!');
    };
}]);
