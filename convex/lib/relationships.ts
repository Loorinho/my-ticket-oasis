import { FieldTypeFromFieldPath, Indexes, NamedTableInfo } from "convex/server";
import { DataModel, Doc, Id, TableNames } from "../_generated/dataModel";
import { DatabaseReader } from "../_generated/server";

/**
 * asyncMap returns the results of applying an async function over an list.
 *
 * @param list - Iterable object of items, e.g. an Array, Set, Object.keys
 * @param asyncTransform
 * @returns
 */
export async function asyncMap<FromType, ToType>(
  list: FromType[],
  asyncTransform: (item: FromType) => Promise<ToType>
): Promise<ToType[]> {
  const promises: Promise<ToType>[] = [];
  for (const item of list) {
    promises.push(asyncTransform(item));
  }
  return Promise.all(promises);
}

/**
 * getAll returns a list of Documents corresponding to the `Id`s passed in.
 * @param db A database object, usually passed from a mutation or query ctx.
 * @param ids An list (or other iterable) of Ids pointing to a table.
 * @returns The Documents referenced by the Ids, in order. `null` if not found.
 */
export async function getAll<TableName extends TableNames>(
  db: DatabaseReader,
  ids: Id<TableName>[]
): Promise<(Doc<TableName> | null)[]> {
  return asyncMap(ids, db.get);
}

// `FieldPath`s that have a `"FieldPath"` index on [`FieldPath`, ...]
// type LookupFieldPaths<TableName extends TableNames> =   {[FieldPath in DataModel[TableName]["fieldPaths"]]: FieldPath extends keyof DataModel[TableName]["indexes"]? Indexes<NamedTableInfo<DataModel, TableName>>[FieldPath][0] extends FieldPath ? FieldPath : never: never}[DataModel[TableName]["fieldPaths"]]

// `FieldPath`s that have a `"by_${FieldPath}""` index on [`FieldPath`, ...]
type LookupFieldPaths<TableName extends TableNames> = {
  [FieldPath in DataModel[TableName]["fieldPaths"]]: `by_${FieldPath}` extends keyof DataModel[TableName]["indexes"]
    ? Indexes<
        NamedTableInfo<DataModel, TableName>
      >[`by_${FieldPath}`][0] extends FieldPath
      ? FieldPath
      : never
    : never;
}[DataModel[TableName]["fieldPaths"]];

type TablesWithLookups = {
  [TableName in TableNames]: LookupFieldPaths<TableName> extends never
    ? never
    : TableName;
}[TableNames];

/**
 * Get a document that references a value with a field indexed `by_${field}`
 *
 * Useful for fetching a document with a one-to-one relationship via backref.
 * @param db DatabaseReader, passed in from the function ctx
 * @param table The table to fetch the target document from.
 * @param field The field on that table that should match the specified value.
 * @param value The value to look up the document by, usually an ID.
 * @returns The document matching the value, or null if none found.
 */
export async function getOneFrom<
  TableName extends TablesWithLookups,
  Field extends LookupFieldPaths<TableName>,
>(
  db: DatabaseReader,
  table: TableName,
  field: Field,
  value: FieldTypeFromFieldPath<Doc<TableName>, Field>
): Promise<Doc<TableName> | null> {
  const ret = db
    .query(table)
    .withIndex("by_" + field, (q) => q.eq(field, value as any))
    .unique();
  return ret;
}

// /**
//  * Get a document that references a value with a field indexed `by_${field}`
//  *
//  * Useful for fetching a document with a one-to-one relationship via backref.
//  * @param db DatabaseReader, passed in from the function ctx
//  * @param table The table to fetch the target document from.
//  * @param field The field on that table that should match the specified value.
//  * @param value The value to look up the document by, usually an ID.
//  * @returns The document matching the value, or null if none found.
//  */
// export async function getOneFrom<
//   TableName extends TablesWithLookups,
//   Field extends LookupFieldPaths<TableName>
// >(
//   db: DatabaseReader,
//   table: TableName,
//   field: Field,
//   value: FieldTypeFromFieldPath<Doc<TableName>, Field>
// ): Promise<Doc<TableName> | null> {
//   const ret = db
//     .query(table)
//     .withIndex("by_" + field, (q) => q.eq(field, value as any))
//     .unique();
//   return ret;
// }
