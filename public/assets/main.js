$(function() {
  (function(window, $) {
    var QUERIES = {
      a: {
        types: [
          'DOMAIN'
        ],
        output: 'table',
        fields: [
          {
            name: 'address',
            type: 'addr'
          },
          {
            name: 'ttl',
            type: 'time'
          }
        ]
      },
      aaaa: {
        types: [
          'DOMAIN'
        ],
        output: 'table',
        fields: [
          'address',
          {
            name: 'ttl',
            type: 'time'
          }
        ]
      },
      cname: {
        types: [
          'DOMAIN'
        ],
        output: 'table',
        fields: [
          {
            name: 'data',
            type: 'addr'
          },
          {
            name: 'ttl',
            type: 'time'
          }
        ]
      },
      mx: {
        types: [
          'DOMAIN'
        ],
        output: 'table',
        fields: [
          'priority',
          {
            name: 'exchange',
            type: 'addr'
          },
          {
            name: 'ttl',
            type: 'time'
          }
        ]
      },
      naptr: {
        types: [
          'DOMAIN'
        ],
        output: 'table',
        fields: [
          'order',
          'preference',
          'flags',
          'service',
          'regexp',
          {
            name: 'ttl',
            type: 'time'
          }
        ]
      },
      ns: {
        types: [
          'DOMAIN'
        ],
        output: 'table',
        fields: [
          {
            name: 'data',
            type: 'addr'
          },
          {
            name: 'ttl',
            type: 'time'
          }
        ]
      },
      ptr: {
        types: [
          'DOMAIN'
        ],
        output: 'table',
        fields: [
          'data',
          {
            name: 'ttl',
            type: 'time'
          }
        ]
      },
      soa: {
        types: [
          'DOMAIN'
        ],
        output: 'table',
        fields: [
          'primary',
          'admin',
          'serial',
          'refresh',
          'retry',
          'expiration',
          'minimum',
          {
            name: 'ttl',
            type: 'time'
          }
        ]
      },
      srv: {
        types: [
          'DOMAIN'
        ],
        output: 'table',
        fields: [
          'priority',
          'weight',
          'port',
          'target',
          {
            name: 'ttl',
            type: 'time'
          }
        ]
      },
      txt: {
        types: [
          'DOMAIN'
        ],
        output: 'table',
        fields: [
          'data',
          {
            name: 'ttl',
            type: 'time'
          }
        ]
      },
      rdns: {
        types: [
          'IP'
        ],
        output: 'table',
        fields: [
          {
            name: 'address',
            type: 'addr'
          }
        ]
      },
      whois: {
        types: [
          'DOMAIN',
          'IP'
        ],
        output: 'pre'
      },
      geo: {
        types: [
          'DOMAIN',
          'IP'
        ],
        output: 'map',
        fields: [
        ]
      }
    };

    var map = mapbox.map($('#geo .map')[0]);
    map.addLayer(mapbox.layer().id('hjr265.map-oc3vrjnl'));
    map.ui.zoomer.add();
    map.ui.attribution.add().content('<a href="http://mapbox.com/about/maps">Powered by MapBox</a>');

    var addrCur = null
      , typeCur = null;

    $(window).on('statechange', function() {
      var state = History.getState()
        , hash = state.hash.replace(/\?&_suid=.+$/, '');

      switch(hash) {
      case '/':
        $('#home').show().siblings().hide();
        $('#prompt form input[name=addr]').val('').focus();
        break;

      default:
        var parts = hash.split('/')
          , addr = parts[1]
          , type = parts[2];

        var addrKind;
        if(addr.match(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/)) {
          addrKind = 'IP';
        } else if(addr.match(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/)) {
          addrKind = 'DOMAIN';
        } else {
          alert('404');
          break;
        }

        if(!type) {
          if(typeCur && QUERIES[typeCur].types.indexOf(addrKind) != -1) {
            History.replaceState(state.data, state.title, '/' + addr + '/' + typeCur);
            return;
          }

          switch(addrKind) {
          case 'IP':
            History.replaceState(state.data, state.title, '/' + addr + '/rdns');
            return;
          case 'DOMAIN':
            History.replaceState(state.data, state.title, '/' + addr + '/a');
            return;
          }
        }
        
        var addrChg = addr != addrCur;
        addrCur = addr;
        typeCur = type;

        document.title = 'Dots – ' + addr;

        $('#prompt form input[name=addr]').val(addr).blur();

        $('#results .nav li').removeClass('active').filter('.' + type).addClass('active');
        if(addrChg) {
          $('#results .nav li a').each(function() {
            var $this = $(this)
              , type = $this.text().toLowerCase();
            $this.attr('href', '/' + addr + '/' + type);
            $this.toggle(QUERIES[type].types.indexOf(addrKind) != -1);
          });
        }
        
        $('#' + type).addClass('loading');

        switch(QUERIES[type].output) {
        case 'table':
          $('#' + type + ' table tbody').empty();
          break;

        case 'map':
          map.zoom(2).center({ lat: 0, lon: 0 });
          map.removeLayer('markers');

        case 'pre':
          $('#' + type + ' pre').html('');
          break;
        }

        $.post('/', {
          type: type,
          addr: addr
        }, function(data) {
          $('#' + type).removeClass('loading');

          switch(QUERIES[type].output) {
          case 'table':
            $('#' + type + ' table tbody').empty();
            $.each(data.records, function(_, record) {
              $('#' + type + ' table tbody').append(
                $('<tr></tr>').append(
                  $.map(QUERIES[type].fields, function(field) {
                    if(typeof field == 'string') {
                      field = {
                        name: field
                      };
                    }

                    switch(field.type) {
                    case 'addr':
                      return $('<td></td>').append(
                        $('<a></a>').attr('href', '/' + record[field.name].toLowerCase()).text(record[field.name])
                      )[0];

                    case 'time':
                      return $('<td></td>').text(record[field.name])[0];

                    default:
                      return $('<td></td>').text(record[field.name])[0];
                    }
                  })
                )
              );
            });
            break;

          case 'map':
            data.records = $.grep(data.records, function(record) {
              if(record.remove) {
                return false;
              }
              record.addresses = [
                record.address
              ];
              $.each(data.records, function(_, other) {
                if(record == other) {
                  return;
                }
                if(record.country == other.country) {
                  record.addresses.push(other.address);
                  other.remove = true;
                }
              });
              return true;
            });

            map.zoom(2).center({ lat: 0, lon: 0 });
            map.removeLayer('markers');

            if(data.records.length == 0) {
              break;
            }

            var markers = mapbox.markers.layer().named('markers');
            mapbox.markers.interaction(markers);
            map.addLayer(markers);
            $.each(data.records, function(_, record) {
              markers.add_feature({
                geometry: {
                  coordinates: record.coordinates.reverse()
                },
                properties: {
                  title: record.country,
                  description: record.addresses.join(', ')
                }
              });
            });
            map.setExtent(markers.extent());
            map.zoom(2);
            break;

          case 'pre':
            $('#' + type + ' pre').html('');
            $.each(data.records, function(_, record) {
              $('#' + type + ' pre').text(record.data);
            });
            break;
          }
        });

        $('#results section').hide().filter('#' + type).show();
        $('#results').show().siblings().hide();
        break;
      }

      try {
        GoSquared.DefaultTracker.TrackView();
      } catch(e) {}
    });

    $('body').delegate('a[href^="/"]', 'click', function() {
      History.pushState({
        _: Math.random()
      }, 'Dots', $(this).attr('href'));
      return false;
    });

    $('#head .logo').click(function() {
      $('#prompt form input[name=addr]').focus();
    });

    $('#prompt form').submit(function() {
      var addr = $('input[name=addr]', this).val();

      if(!addr || !addr.match(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/)) {
        $('input[name=addr]', this).focus().tooltip('show');
        return false;
      }

      addrCur = null;
      History.pushState({
        _: Math.random()
      }, 'Dots', '/' + addr);
      return false;
    });

    $('#prompt form input[name=addr]').tooltip({
      animation: false,
      placement: 'bottom',
      container: 'body',
      trigger: 'focus'
    });

    $(window).trigger('statechange');
  })(window, jQuery);
});