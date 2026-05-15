import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { MatTable } from '@angular/material/table';
import { Pilot } from '../../models/pilots';
import { PilotService } from '../../../services/pilots.service';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent {
  @ViewChild(MatTable) table!: MatTable<Pilot>;
  displayedColumns: string[] = ['name', 'age', 'nationality', 'weight', 'height', 'number', 'actions'];
  dataSource: Pilot[] = [];

  constructor(public dialog: MatDialog, private pilotService: PilotService) {
    this.pilotService.getPilots().subscribe((data: Pilot[]) => {
      this.dataSource = data;
    });
  }

  openDialog(pilot: Pilot | null): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: pilot !== null ? { ...pilot } : {
        name: '',
        age: null,
        nationality: '',
        weight: '',
        height: '',
        number: null
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result !== null) {
        if (result.id !== undefined && result.id !== null) {
          this.pilotService.editPilot(result)
            .subscribe((data: Pilot) => {
              const index = this.dataSource.findIndex(p => p.id === result.id);
              if (index !== -1) {
                this.dataSource[index] = data;
                this.table.renderRows();
              }
            });
        } else {
          this.pilotService.createPilot(result)
            .subscribe((data: Pilot) => {
              this.dataSource.push(data);
              this.table.renderRows();
            });
        }
      }
    });
  }

  editPilot(pilot: Pilot): void {
    this.openDialog(pilot);
  }

  deletePilot(id: number): void {
    this.pilotService.deletePilot(id).subscribe(() => {
      this.dataSource = this.dataSource.filter(p => p.id !== id);
      this.table.renderRows();
    });
  }
}
