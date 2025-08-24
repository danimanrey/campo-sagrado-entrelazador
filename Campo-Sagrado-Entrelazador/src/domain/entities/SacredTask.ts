// MEJOR PRÁCTICA: Domain-Driven Design
// src/domain/entities/SacredTask.ts
export class SacredTask {
    private constructor(
      private readonly id: TaskId,
      private readonly name: TaskName,
      private readonly priority: Priority,
      private readonly isNonNegotiable: boolean
    ) {}
  
    static create(props: CreateTaskProps): Either<Error, SacredTask> {
      // Validación de negocio
      if (props.priority < 1 || props.priority > 10) {
        return left(new InvalidPriorityError());
      }
      // ... más validaciones
      return right(new SacredTask(...));
    }
  }