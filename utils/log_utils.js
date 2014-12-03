/*jshint node:true, indent:2, white:true, laxcomma:true, undef:true, strict:true, unused:true, eqnull:true, camelcase: false, trailing: true */
'use strict';

module.exports = function (db) {
  
  var moment = require('moment');

  var save_log = function* (log) {
    let result = yield db.atomic('youform', 'logs', undefined, log);
    return result;
  };

  var get_logs = function (api_key, callback) {
    var year = moment().year();
    var month = moment().month();

    async.parallel([
        function (cb) {
          db.view('youform', 'graph', {
            key: [api_key, year]
          , include_docs: true
          }, function (err, body) {
            cb(err, body.rows);
          });
        },
        function (cb) {
          if (month !== 12) {
            db.view('youform', 'graph', {
              key: [api_key, (year - 1)]
            , include_docs: true
            }, function (err, body) {
              cb(err, body.rows);
            });
          } else {
            cb(null, []);
          }
        }
      ], function (err, results) {
        if (err) {
          callback(err);
        } else {
          callback(null, results[1].concat(results[0]));
        }
      });
  };

  var get_graph = function (api_key, callback) {
    var graph = {}
      , year = moment().year()
      , month = moment().month() + 1
      , i
      ;

    get_logs(api_key, function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        // init graph obj
        for (i = month + 1; i <= 12; ++i) {
          graph[(year - 1) + '-' + i] = [(year - 1), i, 0, 0];
        }
        for (i = 1; i <= month; ++i) {
          graph[year + '-' + i] = [year, i, 0, 0];
        }
        // parse logs
        result.forEach(function (row) {
          if (Object.has(graph, (row.key[1] + '-' + row.value))) {
            if (!row.doc.spam) {
              graph[row.key[1] + '-' + row.value][2] += 1;
            } else {
              graph[row.key[1] + '-' + row.value][3] += 1;
            }
          }
        });

        callback(null, Object.values(graph));
      }
    });
  };
 
  return {
    'save_log': save_log
  , 'get_logs': get_logs
  , 'get_graph': get_graph
  };
};