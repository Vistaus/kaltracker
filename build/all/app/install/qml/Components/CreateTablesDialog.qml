/*
 * 2021  Ivo Xavier
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3.
 *
 * kaltracker is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import QtQuick 2.9
import Ubuntu.Components 1.3
import Ubuntu.Components.Popups 1.3
import QtQuick.LocalStorage 2.12
import QtQuick.Layouts 1.3
import "../js/DataBaseTools.js" as DataBase

Dialog {
    id: createTablesDialog
    objectName: 'CreateTablesDialog'
    text: i18n.tr("Preparing Everything For You")

   
    Column{ 
        spacing: units.gu(2)

        Timer{
            id: timer
            repeat: false
        }

        ActivityIndicator {
            id: loadingCircle
        
            anchors.horizontalCenter: parent.horizontalCenter
            running: false
            onRunningChanged: {
                
                var msg = i18n.tr("Finished")

                function animationState(delayMiliseconds, cb) {
                    timer.interval = delayMiliseconds;
                    timer.triggered.connect(cb);
                    timer.start();
                }  
                
                animationState(4000, function () {
                    createTablesDialog.text = msg
                    root.userWeight = DataBase.getUserWeight() 
                    root.userHeight = DataBase.getUserHeight() 
                    root.userGoal = DataBase.getUserGoal()
                    root.userActivityLevel = DataBase.getUserActivityLevel()
                    root.userAge = DataBase.getUserAge()
                    root.userSex = DataBase.getUserSex()
                    root.userGoalCategory = DataBase.getUserGoalCategory()
                    root.userName = DataBase.getUserName()
                    PopupUtils.close(createTablesDialog)
                    mainStack.push(resumePage)
                })
    
            }
        }
    }

    Component.onCompleted: {
       loadingCircle.running = true
    }
}